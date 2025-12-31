import { describe, test, expect } from 'vitest';
import {
	slugifyBlockId,
	countPaginatedBlocks,
	parsePageFromUrlForBlock,
	buildPageUrlForBlock
} from './api';

/**
 * Integration tests for the Listing in Grid feature
 *
 * These tests verify end-to-end behavior of multiple listings
 * with independent pagination on the same page.
 */

describe('Listing in Grid - Integration Tests', () => {
	describe('Two listings on same page use different URL parameters', () => {
		test('multiple listing blocks each get their own page parameter', () => {
			// Setup: Page with two listing blocks
			const blocks = {
				'listing-1': { '@type': 'listing' },
				'listing-2': { '@type': 'listing' },
				'text-block': { '@type': 'slate' }
			};
			const blocksLayoutItems = ['listing-1', 'listing-2', 'text-block'];

			// Count should be 2 (two listing blocks)
			const count = countPaginatedBlocks(blocks, blocksLayoutItems);
			expect(count).toBe(2);

			// Build URLs for each listing - should use block-specific keys
			const url1Page3 = buildPageUrlForBlock('http://example.com/page', 3, 'listing-1', count);
			const url2Page5 = buildPageUrlForBlock('http://example.com/page', 5, 'listing-2', count);

			// Each should have its own parameter
			expect(url1Page3).toContain('page-listing_1=3');
			expect(url2Page5).toContain('page-listing_2=5');

			// The parameters should be independent (not affect each other)
			expect(url1Page3).not.toContain('listing_2');
			expect(url2Page5).not.toContain('listing_1');
		});

		test('parsing URL extracts correct page for each listing block', () => {
			// URL with both listings at different pages
			const url = new URL(
				'http://example.com/page?page-listing_1=3&page-listing_2=5&filter=active'
			);

			const paginatedBlockCount = 2;

			// Parse page for listing-1 (should be 3)
			const page1 = parsePageFromUrlForBlock(url, 'listing-1', paginatedBlockCount);
			expect(page1).toBe(3);

			// Parse page for listing-2 (should be 5)
			const page2 = parsePageFromUrlForBlock(url, 'listing-2', paginatedBlockCount);
			expect(page2).toBe(5);

			// Unknown listing should default to page 1
			const page3 = parsePageFromUrlForBlock(url, 'listing-3', paginatedBlockCount);
			expect(page3).toBe(1);
		});
	});

	describe('Listing in grid receives correct pagination context', () => {
		test('nested listing in grid is counted with other paginated blocks', () => {
			// Setup: Top-level listing + listing nested in grid
			const blocks = {
				'top-listing': { '@type': 'listing' },
				'grid-block': {
					'@type': 'gridBlock',
					blocks: {
						'nested-listing': { '@type': 'listing' },
						'nested-image': { '@type': 'image' }
					},
					blocks_layout: { items: ['nested-listing', 'nested-image'] }
				}
			};
			const blocksLayoutItems = ['top-listing', 'grid-block'];

			// Count should include both top-level and nested listing
			const count = countPaginatedBlocks(blocks, blocksLayoutItems);
			expect(count).toBe(2);

			// Build URL for nested listing - should use block-specific key
			const url = buildPageUrlForBlock(
				'http://example.com/page',
				2,
				'nested-listing',
				count
			);
			expect(url).toContain('page-nested_listing=2');
		});

		test('listing in grid has independent pagination from top-level listing', () => {
			// Both listings at different pages
			const url = new URL(
				'http://example.com/page?page-top_listing=4&page-nested_listing=2'
			);

			const paginatedBlockCount = 2;

			// Top-level listing at page 4
			const topPage = parsePageFromUrlForBlock(url, 'top-listing', paginatedBlockCount);
			expect(topPage).toBe(4);

			// Nested listing at page 2
			const nestedPage = parsePageFromUrlForBlock(url, 'nested-listing', paginatedBlockCount);
			expect(nestedPage).toBe(2);
		});
	});

	describe('URL parameter preservation during pagination navigation', () => {
		test('navigating one listing preserves other listing page parameters', () => {
			// Starting URL: listing-1 at page 3, listing-2 at page 5
			const baseUrl = 'http://example.com/page?page-listing_1=3&page-listing_2=5&filter=active';

			const paginatedBlockCount = 2;

			// User navigates listing-1 to page 4
			const url = new URL(baseUrl);
			// First delete old param, then set new one (simulating full URL rebuild)
			url.searchParams.delete('page-' + slugifyBlockId('listing-1'));
			url.searchParams.set('page-' + slugifyBlockId('listing-1'), '4');

			// listing-2 should still be at page 5
			expect(url.searchParams.get('page-listing_2')).toBe('5');

			// Filter should be preserved
			expect(url.searchParams.get('filter')).toBe('active');

			// listing-1 should be at page 4
			expect(url.searchParams.get('page-listing_1')).toBe('4');
		});

		test('buildPageUrlForBlock preserves other query parameters', () => {
			// URL with existing params from another listing
			const baseUrl = 'http://example.com/page?page-listing_2=5&filter=active';

			const paginatedBlockCount = 2;

			// Navigate listing-1 to page 3
			const newUrl = buildPageUrlForBlock(baseUrl, 3, 'listing-1', paginatedBlockCount);

			// Should contain both listing page params and filter
			expect(newUrl).toContain('page-listing_1=3');
			expect(newUrl).toContain('page-listing_2=5');
			expect(newUrl).toContain('filter=active');
		});
	});

	describe('Single listing fallback to simple page parameter', () => {
		test('single listing uses simple page parameter', () => {
			const blocks = {
				'only-listing': { '@type': 'listing' },
				'text-block': { '@type': 'slate' }
			};
			const blocksLayoutItems = ['only-listing', 'text-block'];

			// Count should be 1
			const count = countPaginatedBlocks(blocks, blocksLayoutItems);
			expect(count).toBe(1);

			// Build URL - should use simple 'page' key
			const url = buildPageUrlForBlock('http://example.com/page', 3, 'only-listing', count);
			expect(url).toBe('/page?page=3');
			expect(url).not.toContain('page-');

			// Parse URL - should use simple 'page' key
			const parsedUrl = new URL('http://example.com/page?page=3');
			const page = parsePageFromUrlForBlock(parsedUrl, 'only-listing', count);
			expect(page).toBe(3);
		});
	});
});
