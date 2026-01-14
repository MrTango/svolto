import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	slugifyBlockId,
	countPaginatedBlocks,
	parsePageFromUrlForBlock,
	buildPageUrlForBlock,
	fetchListingData
} from './api';

// Mock env module
vi.mock('$env/static/public', () => ({
	PUBLIC_API_PATH: 'http://localhost:8088/Plone'
}));

describe('Pagination Utilities', () => {
	describe('slugifyBlockId', () => {
		test('converts block ID to URL-safe format', () => {
			// Plone block IDs are typically UUIDs like "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
			expect(slugifyBlockId('a1b2c3d4-e5f6-7890-abcd-ef1234567890')).toBe(
				'a1b2c3d4_e5f6_7890_abcd_ef1234567890'
			);
			// Simple alphanumeric stays lowercase
			expect(slugifyBlockId('block123')).toBe('block123');
			// Mixed case becomes lowercase
			expect(slugifyBlockId('Block-123')).toBe('block_123');
		});
	});

	describe('countPaginatedBlocks', () => {
		test('counts top-level and nested listing/search blocks', () => {
			// Create blocks structure with top-level listing and nested in grid
			const blocks = {
				'block-1': { '@type': 'listing' },
				'block-2': { '@type': 'slate' },
				'block-3': {
					'@type': 'gridBlock',
					blocks: {
						'nested-1': { '@type': 'listing' },
						'nested-2': { '@type': 'image' }
					},
					blocks_layout: { items: ['nested-1', 'nested-2'] }
				},
				'block-4': { '@type': 'search' }
			};
			const blocksLayoutItems = ['block-1', 'block-2', 'block-3', 'block-4'];

			// Should count: block-1 (listing), nested-1 (listing in grid), block-4 (search) = 3
			expect(countPaginatedBlocks(blocks, blocksLayoutItems)).toBe(3);
		});

		test('returns 0 when no paginated blocks exist', () => {
			const blocks = {
				'block-1': { '@type': 'slate' },
				'block-2': { '@type': 'image' }
			};
			const blocksLayoutItems = ['block-1', 'block-2'];

			expect(countPaginatedBlocks(blocks, blocksLayoutItems)).toBe(0);
		});
	});

	describe('parsePageFromUrlForBlock', () => {
		test('uses simple page param when single paginated block', () => {
			const url = new URL('http://example.com/path?page=3');
			expect(parsePageFromUrlForBlock(url, 'block-123', 1)).toBe(3);
		});

		test('uses block-specific page param when multiple paginated blocks', () => {
			// With multiple blocks, uses page-{slugifiedBlockId}
			const url = new URL('http://example.com/path?page-block_123=5');
			expect(parsePageFromUrlForBlock(url, 'block-123', 2)).toBe(5);
		});

		test('returns 1 when page param not present', () => {
			const url = new URL('http://example.com/path');
			expect(parsePageFromUrlForBlock(url, 'block-123', 1)).toBe(1);
			expect(parsePageFromUrlForBlock(url, 'block-123', 2)).toBe(1);
		});
	});

	describe('buildPageUrlForBlock', () => {
		test('uses simple page param when single paginated block', () => {
			const result = buildPageUrlForBlock('http://example.com/path', 3, 'block-123', 1);
			expect(result).toBe('/path?page=3');
		});

		test('uses block-specific page param when multiple paginated blocks', () => {
			const result = buildPageUrlForBlock('http://example.com/path', 5, 'block-123', 2);
			expect(result).toBe('/path?page-block_123=5');
		});

		test('preserves existing query parameters', () => {
			const result = buildPageUrlForBlock(
				'http://example.com/path?filter=active',
				3,
				'block-123',
				1
			);
			expect(result).toContain('filter=active');
			expect(result).toContain('page=3');
		});

		test('removes page param for page 1', () => {
			const result = buildPageUrlForBlock('http://example.com/path', 1, 'block-123', 1);
			expect(result).toBe('/path');
		});
	});
});

describe('fetchListingData', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	test('includes metadata_fields: "_all" in request body for image data', async () => {
		const mockResponse = {
			items: [{ '@id': 'test', title: 'Test', image_field: 'image', image_scales: {} }],
			items_total: 1
		};
		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockResponse)
		} as Response);

		const querystring = {
			query: [
				{
					i: 'portal_type',
					o: 'plone.app.querystring.operation.selection.any',
					v: 'News Item'
				}
			]
		};

		await fetchListingData(querystring, 0, 10, 'http://test.plone/');

		expect(globalThis.fetch).toHaveBeenCalledTimes(1);
		const [, fetchOptions] = vi.mocked(globalThis.fetch).mock.calls[0];
		const requestBody = JSON.parse(fetchOptions?.body as string);

		expect(requestBody.metadata_fields).toBe('_all');
	});

	test('returns empty response when no querystring provided', async () => {
		const result = await fetchListingData(undefined);
		expect(result.items).toEqual([]);
		expect(result.total).toBe(0);
	});

	test('returns empty response when querystring has no query', async () => {
		const result = await fetchListingData({ query: [] });
		expect(result.items).toEqual([]);
		expect(result.total).toBe(0);
	});
});
