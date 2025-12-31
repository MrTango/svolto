import { API_PATH } from '$env/static/private';
import { createClient } from '$lib/api';
import {
	fetchListingData,
	DEFAULT_BATCH_SIZE,
	countPaginatedBlocks,
	parsePageFromUrlForBlock
} from '$lib/blocks/listing/api';

export const prerender = false;
export const trailingSlash = 'always';

const serverClient = createClient(API_PATH);

/**
 * Find all listing blocks in the page, including those nested within grid blocks
 *
 * @param {Record<string, any>} blocks - Object mapping block IDs to block data
 * @param {string[]} blocksLayoutItems - Array of block IDs in layout order
 * @returns {Array<{blockId: string, blockData: any, parentGridId?: string}>} Array of listing block info
 */
function findAllListingBlocks(blocks, blocksLayoutItems) {
	/** @type {Array<{blockId: string, blockData: any, parentGridId?: string}>} */
	const listingBlocks = [];

	for (const blockId of blocksLayoutItems) {
		const blockData = blocks[blockId];
		if (!blockData) continue;

		const blockType = blockData['@type'];

		// Include top-level listing blocks
		if (blockType === 'listing') {
			listingBlocks.push({ blockId, blockData });
		}

		// Traverse grid blocks to find nested listing blocks
		if (blockType === 'gridBlock' && blockData.blocks && blockData.blocks_layout?.items) {
			for (const nestedBlockId of blockData.blocks_layout.items) {
				const nestedBlock = blockData.blocks[nestedBlockId];
				if (nestedBlock?.['@type'] === 'listing') {
					listingBlocks.push({
						blockId: nestedBlockId,
						blockData: nestedBlock,
						parentGridId: blockId
					});
				}
			}
		}
	}

	return listingBlocks;
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	let currentPath = '/';
	if (event.params.path != undefined) {
		currentPath = event.params.path;
	}
	console.log(currentPath);

	const { getContent } = serverClient;

	const data = await getContent({ path: currentPath });
	console.log(await data);

	// Pre-fetch listing block data
	/** @type {Record<string, import('$lib/blocks/listing/types').ListingResponse>} */
	const listingData = {};

	// Track per-block page numbers for correct pagination display
	/** @type {Record<string, number>} */
	const listingPages = {};

	// Count paginated blocks to determine pagination key strategy
	let paginatedBlockCount = 0;

	if (data.blocks && data.blocks_layout?.items) {
		// Count all paginated blocks (listing, search) including nested ones
		paginatedBlockCount = countPaginatedBlocks(data.blocks, data.blocks_layout.items);

		// Find all listing blocks including those nested in grids
		const allListingBlocks = findAllListingBlocks(data.blocks, data.blocks_layout.items);

		// Fetch data for each listing block with its specific page
		for (const { blockId, blockData } of allListingBlocks) {
			// Parse block-specific page from URL
			const blockPage = parsePageFromUrlForBlock(event.url, blockId, paginatedBlockCount);
			listingPages[blockId] = blockPage;

			if (blockData.querystring?.query?.length > 0) {
				const batchSize = blockData.b_size || blockData.querystring?.b_size || DEFAULT_BATCH_SIZE;
				const bStart = (blockPage - 1) * batchSize;

				listingData[blockId] = await fetchListingData(
					blockData.querystring,
					bStart,
					batchSize,
					API_PATH
				);
			}
		}
	}

	return { ...data, listingData, listingPages, paginatedBlockCount };
}
