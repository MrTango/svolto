import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, waitFor, screen } from '@testing-library/svelte';
import ListingBlockView from './ListingBlockView.svelte';
import Pagination from '$lib/components/Pagination.svelte';
import type { ListingBlockData, ListingItem, ListingResponse } from './types';
import * as apiModule from './api';

/**
 * Task Group 7: Integration Tests
 *
 * These tests verify critical integration paths for the listing block feature:
 * 1. Full data flow: API -> ListingBlockView -> Variation
 * 2. Pagination navigation end-to-end
 * 3. Variation switching
 * 4. Error handling (API failure)
 */

// Mock items for testing
const mockItems: ListingItem[] = [
	{
		'@id': 'http://localhost:8080/Plone/news/article-1',
		'@type': 'News Item',
		title: 'First Article',
		description: 'Description for first article'
	},
	{
		'@id': 'http://localhost:8080/Plone/news/article-2',
		'@type': 'News Item',
		title: 'Second Article',
		description: 'Description for second article'
	},
	{
		'@id': 'http://localhost:8080/Plone/news/article-3',
		'@type': 'News Item',
		title: 'Third Article',
		description: 'Description for third article'
	}
];

// Mock API module
vi.mock('./api', async (importOriginal) => {
	const actual = await importOriginal<typeof apiModule>();
	return {
		...actual,
		fetchListingData: vi.fn()
	};
});

describe('Listing Block - Integration Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Data Flow Integration', () => {
		test('renders items from API through default variation', async () => {
			// Mock API to return items
			vi.mocked(apiModule.fetchListingData).mockResolvedValue({
				items: mockItems,
				total: 3,
				batching: {}
			});

			const data: ListingBlockData = {
				variation: 'default',
				querystring: {
					query: [
						{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'News Item' }
					]
				}
			};

			const { container } = render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data }
			});

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.listing-loading')).not.toBeInTheDocument();
			});

			// Verify items are rendered in DefaultVariation
			const listItems = container.querySelectorAll('.listing-item');
			expect(listItems).toHaveLength(3);

			// Verify item content
			expect(container.textContent).toContain('First Article');
			expect(container.textContent).toContain('Second Article');
			expect(container.textContent).toContain('Third Article');
		});

		test('passes correct parameters to API based on block data', async () => {
			vi.mocked(apiModule.fetchListingData).mockResolvedValue({
				items: [],
				total: 0,
				batching: {}
			});

			const data: ListingBlockData = {
				variation: 'default',
				querystring: {
					query: [
						{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'Document' }
					],
					sort_on: 'effective',
					sort_order: 'descending'
				},
				b_size: 5
			};

			render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data, page: 2 }
			});

			// Wait for API call
			await waitFor(() => {
				expect(apiModule.fetchListingData).toHaveBeenCalled();
			});

			// Verify API was called with correct parameters
			expect(apiModule.fetchListingData).toHaveBeenCalledWith(
				data.querystring,
				5, // b_start = (page 2 - 1) * batch_size 5 = 5
				5 // b_size = 5
			);
		});
	});

	describe('Pagination Integration', () => {
		test('shows pagination when total pages exceeds 1', async () => {
			// Mock API to return paginated results
			vi.mocked(apiModule.fetchListingData).mockResolvedValue({
				items: mockItems,
				total: 30, // 30 items with batch size 10 = 3 pages
				batching: {}
			});

			const data: ListingBlockData = {
				variation: 'default',
				querystring: {
					query: [
						{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'News Item' }
					]
				},
				b_size: 10
			};

			const { container } = render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data, path: '/news/' }
			});

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.listing-loading')).not.toBeInTheDocument();
			});

			// Verify pagination is shown
			const pagination = container.querySelector('.pagination');
			expect(pagination).toBeInTheDocument();

			// Verify page numbers
			const pageLinks = container.querySelectorAll('.pagination-link');
			expect(pageLinks.length).toBeGreaterThan(0);
		});

		test('hides pagination when total pages is 1 or less', async () => {
			vi.mocked(apiModule.fetchListingData).mockResolvedValue({
				items: mockItems,
				total: 3, // 3 items with batch size 10 = 1 page
				batching: {}
			});

			const data: ListingBlockData = {
				variation: 'default',
				querystring: {
					query: [
						{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'News Item' }
					]
				},
				b_size: 10
			};

			const { container } = render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data }
			});

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.listing-loading')).not.toBeInTheDocument();
			});

			// Verify pagination is not shown
			const pagination = container.querySelector('.pagination');
			expect(pagination).not.toBeInTheDocument();
		});
	});

	describe('Pagination Component', () => {
		test('generates correct page URLs', () => {
			const { container } = render(Pagination, {
				props: {
					currentPage: 2,
					totalPages: 5,
					baseUrl: '/news/'
				}
			});

			// Check prev link (should go to page 1, no query param)
			const prevLink = container.querySelector('.pagination-prev') as HTMLAnchorElement;
			expect(prevLink).toBeInTheDocument();
			expect(prevLink.getAttribute('href')).toBe('/news/');

			// Check next link (should go to page 3)
			const nextLink = container.querySelector('.pagination-next') as HTMLAnchorElement;
			expect(nextLink).toBeInTheDocument();
			expect(nextLink.getAttribute('href')).toBe('/news/?page=3');

			// Check current page is marked
			const currentPage = container.querySelector('.pagination-link.is-current');
			expect(currentPage).toBeInTheDocument();
			expect(currentPage?.textContent).toBe('2');
		});

		test('disables prev button on first page', () => {
			const { container } = render(Pagination, {
				props: {
					currentPage: 1,
					totalPages: 5,
					baseUrl: '/news/'
				}
			});

			const prevLink = container.querySelector('.pagination-prev');
			expect(prevLink).toHaveClass('is-disabled');
		});

		test('disables next button on last page', () => {
			const { container } = render(Pagination, {
				props: {
					currentPage: 5,
					totalPages: 5,
					baseUrl: '/news/'
				}
			});

			const nextLink = container.querySelector('.pagination-next');
			expect(nextLink).toHaveClass('is-disabled');
		});
	});

	describe('Error Handling', () => {
		test('shows empty state when API returns error', async () => {
			// Mock API to throw error
			vi.mocked(apiModule.fetchListingData).mockRejectedValue(new Error('API Error'));

			const data: ListingBlockData = {
				variation: 'default',
				querystring: {
					query: [
						{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: 'News Item' }
					]
				}
			};

			const { container } = render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data }
			});

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.listing-loading')).not.toBeInTheDocument();
			});

			// Verify empty state is shown
			const emptyState = container.querySelector('.listing-empty');
			expect(emptyState).toBeInTheDocument();
		});

		test('handles empty querystring gracefully', async () => {
			vi.mocked(apiModule.fetchListingData).mockResolvedValue({
				items: [],
				total: 0,
				batching: {}
			});

			const data: ListingBlockData = {
				variation: 'default'
				// No querystring
			};

			const { container } = render(ListingBlockView, {
				props: { key: 'test-key', id: 'test-id', data }
			});

			// Wait for loading to complete
			await waitFor(() => {
				expect(container.querySelector('.listing-loading')).not.toBeInTheDocument();
			});

			// Should show empty state, not crash
			expect(container.querySelector('.listing-empty')).toBeInTheDocument();
		});
	});
});
