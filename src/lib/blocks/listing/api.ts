/**
 * Data fetching utilities for the Listing Block
 *
 * Provides functions for fetching content from Plone's querystring-search API
 * and calculating pagination values.
 */

import { PUBLIC_API_PATH } from '$env/static/public';
import type { QuerystringConfig, ListingResponse, QuerystringQuery } from './types';

/** Default batch size (items per page) when not specified */
export const DEFAULT_BATCH_SIZE = 10;

/** Block types that support pagination */
const PAGINATED_BLOCK_TYPES = ['listing', 'search'];

// Type for block data structure
interface BlockData {
	'@type'?: string;
	blocks?: Record<string, BlockData>;
	blocks_layout?: { items?: string[] };
}

/**
 * Fetch listing data from Plone's querystring-search API using POST
 *
 * NOTE: We use POST instead of GET because the @plone/client's GET method
 * (getQuerystringSearchQuery) only passes the 'query' parameter and ignores
 * pagination parameters like b_size and b_start. The POST method correctly
 * sends all parameters.
 *
 * @param querystring - Query configuration from the listing block data
 * @param b_start - Starting index for pagination (default: 0)
 * @param b_size - Number of items per page (default: DEFAULT_BATCH_SIZE)
 * @param apiPathOverride - Optional API path for server-side use (overrides PUBLIC_API_PATH)
 * @returns Promise resolving to ListingResponse with items, total, and batching info
 */
export async function fetchListingData(
	querystring: QuerystringConfig | undefined,
	b_start: number = 0,
	b_size: number = DEFAULT_BATCH_SIZE,
	apiPathOverride?: string
): Promise<ListingResponse> {
	// Return empty response if no querystring is provided
	if (!querystring?.query || querystring.query.length === 0) {
		return {
			items: [],
			total: 0,
			batching: {}
		};
	}

	// Get API path from override or use public env variable
	const apiPath = apiPathOverride ?? PUBLIC_API_PATH ?? '';

	try {
		// Build the request body for POST
		const requestBody: {
			query: QuerystringQuery[];
			b_start: number;
			b_size: number;
			sort_on?: string;
			sort_order?: string;
			limit?: number;
		} = {
			query: querystring.query,
			b_start: b_start,
			b_size: b_size
		};

		// Add optional sort parameters if provided
		if (querystring.sort_on) {
			requestBody.sort_on = querystring.sort_on;
		}
		if (querystring.sort_order) {
			requestBody.sort_order = querystring.sort_order;
		}
		if (querystring.limit) {
			requestBody.limit = querystring.limit;
		}

		// Make POST request to querystring-search endpoint
		const response = await fetch(`${apiPath}/@querystring-search`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Normalize the response to match our ListingResponse interface
		return {
			items: data.items || [],
			total: data.items_total ?? data.total ?? 0,
			batching: data.batching || {}
		};
	} catch (error) {
		// Log error for debugging but return empty response to handle gracefully
		console.error('Error fetching listing data:', error);
		return {
			items: [],
			total: 0,
			batching: {}
		};
	}
}

/**
 * Calculate the starting index (b_start) for a given page number
 *
 * @param page - Current page number (1-indexed)
 * @param batchSize - Number of items per page
 * @returns Starting index for the API request
 */
export function calculateBStart(page: number, batchSize: number): number {
	// Ensure page is at least 1
	const safePage = Math.max(1, page);
	// b_start is 0-indexed: page 1 = 0, page 2 = batchSize, etc.
	return (safePage - 1) * batchSize;
}

/**
 * Calculate the total number of pages based on total results and batch size
 *
 * @param total - Total number of results
 * @param batchSize - Number of items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(total: number, batchSize: number): number {
	// Handle edge cases
	if (total <= 0 || batchSize <= 0) {
		return 0;
	}
	// Ceiling division to account for partial pages
	return Math.ceil(total / batchSize);
}

/**
 * Parse the current page number from a URL's query parameters
 *
 * @param url - URL object to extract page parameter from
 * @returns Page number (1-indexed), defaults to 1 if not present or invalid
 */
export function parsePageFromUrl(url: URL): number {
	const pageParam = url.searchParams.get('page');

	if (!pageParam) {
		return 1;
	}

	const page = parseInt(pageParam, 10);

	// Return 1 for invalid, negative, or zero values
	if (isNaN(page) || page < 1) {
		return 1;
	}

	return page;
}

/**
 * Build a URL with the page query parameter
 *
 * @param baseUrl - Base URL string or URL object
 * @param page - Page number to set
 * @returns URL string with page parameter
 */
export function buildPageUrl(baseUrl: string | URL, page: number): string {
	const url = new URL(baseUrl);

	if (page <= 1) {
		// Remove page parameter for page 1
		url.searchParams.delete('page');
	} else {
		url.searchParams.set('page', String(page));
	}

	return url.pathname + url.search;
}

/**
 * Convert a block ID to a URL-safe slug format
 * Matches Volto's slugify behavior for compatibility
 *
 * @param blockId - The block ID to slugify
 * @returns URL-safe slug (lowercase, whitespace/hyphens replaced with underscores, non-word chars removed)
 */
export function slugifyBlockId(blockId: string): string {
	return blockId
		.toLowerCase()
		.replace(/[\s-]+/g, '_')
		.replace(/[^\w]+/g, '');
}

/**
 * Count the number of paginated blocks (listing, search) in a blocks structure
 * Includes both top-level blocks and blocks nested within grid blocks
 *
 * @param blocks - Object mapping block IDs to block data
 * @param blocksLayoutItems - Array of block IDs in layout order
 * @returns Total count of paginated blocks
 */
export function countPaginatedBlocks(
	blocks: Record<string, BlockData>,
	blocksLayoutItems: string[]
): number {
	let count = 0;

	for (const blockId of blocksLayoutItems) {
		const blockData = blocks[blockId];
		if (!blockData) continue;

		const blockType = blockData['@type'];

		// Count top-level paginated blocks
		if (blockType && PAGINATED_BLOCK_TYPES.includes(blockType)) {
			count++;
		}

		// Traverse grid blocks to count nested paginated blocks
		if (blockType === 'gridBlock' && blockData.blocks && blockData.blocks_layout?.items) {
			for (const nestedBlockId of blockData.blocks_layout.items) {
				const nestedBlock = blockData.blocks[nestedBlockId];
				const nestedBlockType = nestedBlock?.['@type'];
				if (nestedBlockType && PAGINATED_BLOCK_TYPES.includes(nestedBlockType)) {
					count++;
				}
			}
		}
	}

	return count;
}

/**
 * Parse the page number for a specific block from URL query parameters
 * Uses simple 'page' param for single block, 'page-{slugifiedBlockId}' for multiple blocks
 *
 * @param url - URL object to extract page parameter from
 * @param blockId - The block ID to get the page for
 * @param paginatedBlockCount - Total number of paginated blocks on the page
 * @returns Page number (1-indexed), defaults to 1 if not present or invalid
 */
export function parsePageFromUrlForBlock(
	url: URL,
	blockId: string,
	paginatedBlockCount: number
): number {
	// Determine which parameter key to use
	const paramKey = paginatedBlockCount <= 1 ? 'page' : `page-${slugifyBlockId(blockId)}`;

	const pageParam = url.searchParams.get(paramKey);

	if (!pageParam) {
		return 1;
	}

	const page = parseInt(pageParam, 10);

	// Return 1 for invalid, negative, or zero values
	if (isNaN(page) || page < 1) {
		return 1;
	}

	return page;
}

/**
 * Build a URL with the appropriate page query parameter for a specific block
 * Uses simple 'page' param for single block, 'page-{slugifiedBlockId}' for multiple blocks
 *
 * @param baseUrl - Base URL string or URL object
 * @param page - Page number to set
 * @param blockId - The block ID to set the page for
 * @param paginatedBlockCount - Total number of paginated blocks on the page
 * @returns URL string with page parameter
 */
export function buildPageUrlForBlock(
	baseUrl: string | URL,
	page: number,
	blockId: string,
	paginatedBlockCount: number
): string {
	const url = new URL(baseUrl);

	// Determine which parameter key to use
	const paramKey = paginatedBlockCount <= 1 ? 'page' : `page-${slugifyBlockId(blockId)}`;

	if (page <= 1) {
		// Remove page parameter for page 1
		url.searchParams.delete(paramKey);
	} else {
		url.searchParams.set(paramKey, String(page));
	}

	return url.pathname + url.search;
}
