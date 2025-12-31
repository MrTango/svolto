import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, waitFor } from '@testing-library/svelte';
import blocks from '../index';
import ListingBlockView from './ListingBlockView.svelte';
import { getVariationComponent, variationRegistry } from './variations/index';
import DefaultVariation from './variations/DefaultVariation.svelte';
import SummaryVariation from './variations/SummaryVariation.svelte';
import ImageGalleryVariation from './variations/ImageGalleryVariation.svelte';
import type { ListingBlockData, ListingItem, ListingResponse, QuerystringQuery } from './types';

// Mock the API module to avoid actual API calls in tests
vi.mock('./api', () => ({
	fetchListingData: vi.fn().mockResolvedValue({
		items: [],
		total: 0,
		batching: {}
	}),
	calculateBStart: vi.fn((page, batchSize) => (page - 1) * batchSize),
	calculateTotalPages: vi.fn((total, batchSize) =>
		total <= 0 || batchSize <= 0 ? 0 : Math.ceil(total / batchSize)
	),
	DEFAULT_BATCH_SIZE: 10
}));

// Task Group 1: Core Infrastructure Tests
describe('Listing Block - Block Registration', () => {
	test('listing block is registered in blocks config', () => {
		expect(blocks.listing).toBeDefined();
		expect(blocks.listing.id).toBe('listing');
		expect(blocks.listing.title).toBe('Listing');
		expect(blocks.listing.view).toBe(ListingBlockView);
	});

	test('ListingBlockView component is exported correctly', () => {
		expect(ListingBlockView).toBeDefined();
		expect(typeof ListingBlockView).toBe('function');
	});

	test('TypeScript interfaces compile without errors', () => {
		// Test that interfaces can be used to define typed objects
		const query: QuerystringQuery = {
			i: 'portal_type',
			o: 'plone.app.querystring.operation.selection.any',
			v: ['Document', 'News Item']
		};

		const item: ListingItem = {
			'@id': 'http://localhost:8080/Plone/my-page',
			'@type': 'Document',
			title: 'Test Page',
			description: 'A test page description'
		};

		const response: ListingResponse = {
			items: [item],
			total: 1,
			batching: {
				next: 'http://localhost:8080/Plone/@querystring-search?b_start=10'
			}
		};

		const blockData: ListingBlockData = {
			variation: 'default',
			headline: 'Latest News',
			headlineTag: 'h2',
			querystring: {
				query: [query],
				sort_on: 'effective',
				sort_order: 'descending'
			},
			linkTitle: 'View All',
			linkHref: [{ '@id': 'http://localhost:8080/Plone/news' }],
			b_size: 10
		};

		// Verify types are correctly structured
		expect(query.i).toBe('portal_type');
		expect(item['@type']).toBe('Document');
		expect(response.total).toBe(1);
		expect(blockData.variation).toBe('default');
	});

	test('variation registry returns correct component for each variation type', () => {
		// Test registry object structure
		expect(variationRegistry).toBeDefined();
		expect(typeof variationRegistry).toBe('object');

		// Test 'default' variation
		expect(getVariationComponent('default')).toBe(DefaultVariation);

		// Test 'summary' variation
		expect(getVariationComponent('summary')).toBe(SummaryVariation);

		// Test 'imageGallery' variation
		expect(getVariationComponent('imageGallery')).toBe(ImageGalleryVariation);

		// Test undefined variation returns default
		expect(getVariationComponent(undefined)).toBe(DefaultVariation);

		// Test unknown variation returns default
		expect(getVariationComponent('nonexistent')).toBe(DefaultVariation);
	});
});

// Basic component rendering tests
describe('Listing Block - Component Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('ListingBlockView renders with minimal data', () => {
		const data: ListingBlockData = {};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).toBeInTheDocument();
	});

	test('ListingBlockView shows empty state when no items', async () => {
		const data: ListingBlockData = {};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Wait for the async effect to complete and loading to finish
		await waitFor(() => {
			const emptyMessage = container.querySelector('.listing-empty');
			expect(emptyMessage).toBeInTheDocument();
		});

		const emptyMessage = container.querySelector('.listing-empty');
		expect(emptyMessage?.textContent).toContain('No results found');
	});

	test('ListingBlockView shows loading state initially', () => {
		const data: ListingBlockData = {};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Initially should show loading state
		const loadingIndicator = container.querySelector('.listing-loading');
		expect(loadingIndicator).toBeInTheDocument();
	});

	test('ListingBlockView applies variation class to container', () => {
		const data: ListingBlockData = {
			variation: 'summary'
		};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).toHaveClass('variation-summary');
	});

	test('ListingBlockView renders headline when provided', () => {
		const data: ListingBlockData = {
			headline: 'Featured Content'
		};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const headline = container.querySelector('h2.headline');
		expect(headline).toBeInTheDocument();
		expect(headline?.textContent).toBe('Featured Content');
	});

	test('ListingBlockView renders h3 headline when headlineTag is h3', () => {
		const data: ListingBlockData = {
			headline: 'Section Title',
			headlineTag: 'h3'
		};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const h3Headline = container.querySelector('h3.headline');
		expect(h3Headline).toBeInTheDocument();
		expect(h3Headline?.textContent).toBe('Section Title');

		// h2 should not exist
		const h2Headline = container.querySelector('h2.headline');
		expect(h2Headline).not.toBeInTheDocument();
	});
});

// Task Group 6: Shared Features Tests
describe('Listing Block - Shared Features', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('headline renders with correct tag (h2 or h3)', () => {
		// Test h2 (default)
		const dataH2: ListingBlockData = {
			headline: 'News Section',
			headlineTag: 'h2'
		};

		const { container: containerH2 } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data: dataH2 }
		});

		const h2Element = containerH2.querySelector('h2.headline');
		expect(h2Element).toBeInTheDocument();
		expect(h2Element?.textContent).toBe('News Section');
		expect(containerH2.querySelector('h3.headline')).not.toBeInTheDocument();

		// Test h3
		const dataH3: ListingBlockData = {
			headline: 'Related Articles',
			headlineTag: 'h3'
		};

		const { container: containerH3 } = render(ListingBlockView, {
			props: { key: 'test-key-2', id: 'test-id-2', data: dataH3 }
		});

		const h3Element = containerH3.querySelector('h3.headline');
		expect(h3Element).toBeInTheDocument();
		expect(h3Element?.textContent).toBe('Related Articles');
		expect(containerH3.querySelector('h2.headline')).not.toBeInTheDocument();
	});

	test('headline hidden when not configured', () => {
		// Test with no headline
		const dataNoHeadline: ListingBlockData = {};

		const { container: containerNoHeadline } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data: dataNoHeadline }
		});

		expect(containerNoHeadline.querySelector('.headline')).not.toBeInTheDocument();
		expect(containerNoHeadline.querySelector('h2.headline')).not.toBeInTheDocument();
		expect(containerNoHeadline.querySelector('h3.headline')).not.toBeInTheDocument();

		// Test with empty headline string
		const dataEmptyHeadline: ListingBlockData = {
			headline: ''
		};

		const { container: containerEmpty } = render(ListingBlockView, {
			props: { key: 'test-key-2', id: 'test-id-2', data: dataEmptyHeadline }
		});

		expect(containerEmpty.querySelector('.headline')).not.toBeInTheDocument();
	});

	test('loading state displays correctly', () => {
		const data: ListingBlockData = {
			querystring: {
				query: [
					{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'Document' }
				]
			}
		};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Initially should show loading state (before API response)
		const loadingIndicator = container.querySelector('.listing-loading');
		expect(loadingIndicator).toBeInTheDocument();

		// Verify loading spinner and text are present
		const loadingSpinner = container.querySelector('.loading-spinner');
		expect(loadingSpinner).toBeInTheDocument();

		const loadingText = container.querySelector('.loading-text');
		expect(loadingText).toBeInTheDocument();
		expect(loadingText?.textContent).toContain('Loading');

		// Verify the block has is-loading class during loading
		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).toHaveClass('is-loading');
	});

	test('empty state displays when no results', async () => {
		const data: ListingBlockData = {
			querystring: {
				query: [
					{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'Document' }
				]
			}
		};

		const { container } = render(ListingBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Wait for async effect to complete (loading finishes with empty results)
		await waitFor(() => {
			const emptyState = container.querySelector('.listing-empty');
			expect(emptyState).toBeInTheDocument();
		});

		// Verify empty message content
		const emptyMessage = container.querySelector('.empty-message');
		expect(emptyMessage).toBeInTheDocument();
		expect(emptyMessage?.textContent).toContain('No results found');

		// Verify loading state is no longer shown
		const loadingIndicator = container.querySelector('.listing-loading');
		expect(loadingIndicator).not.toBeInTheDocument();

		// Verify block no longer has is-loading class
		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).not.toHaveClass('is-loading');
	});
});
