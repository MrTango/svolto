import { API_PATH } from '$env/static/private';
import { createClient } from '$lib/api';
import {
	fetchListingData,
	DEFAULT_BATCH_SIZE,
	countPaginatedBlocks,
	parsePageFromUrlForBlock
} from '$lib/blocks/listing/api';
import { fetchNavigation, DEFAULT_NAV_DEPTH } from '$lib/plone/navigation/api';
import {
	fetchSiteSettings,
	detectLanguageFromHeaders,
	extractTranslations,
	extractLanguageFromPath
} from '$lib/plone/site';
import { getLanguageCookie } from '$lib/utils/language-cookie';

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
	console.log('[SERVER] Load function started');
	let currentPath = '/';
	if (event.params.path != undefined) {
		currentPath = event.params.path;
	}
	console.log('[SERVER] Loading path:', currentPath);

	const { getContent } = serverClient;
	console.log('[SERVER] Got getContent function');

	// Fetch content and site settings in parallel first, then navigation with language path
	let data;
	/** @type {import('$lib/plone/navigation/types').NavigationData} */
	let navigation = { items: [] };
	/** @type {import('$lib/plone/site').SiteSettings} */
	let siteSettings = {
		availableLanguages: ['en'],
		defaultLanguage: 'en',
		useCookieNegotiation: false,
		useRequestNegotiation: false
	};

	try {
		console.log('[SERVER] Calling getContent and fetchSiteSettings...');
		const [contentResult, siteResult] = await Promise.all([
			getContent({ path: currentPath, expand: ['translations'] }),
			fetchSiteSettings(API_PATH)
		]);
		data = contentResult;
		siteSettings = siteResult;
		console.log('[SERVER] getContent returned, title:', data?.title);
		console.log(
			'[SERVER] Site settings loaded, available languages:',
			siteSettings.availableLanguages
		);

		// Determine language from path to fetch language-specific navigation
		const pathLangForNav = extractLanguageFromPath(
			'/' + currentPath,
			siteSettings.availableLanguages
		);
		console.log('[SERVER] Fetching navigation for language path:', pathLangForNav || '(root)');
		navigation = await fetchNavigation(
			DEFAULT_NAV_DEPTH,
			API_PATH,
			pathLangForNav ? `/${pathLangForNav}` : undefined
		);
		console.log('[SERVER] Navigation items count:', navigation.items.length);
	} catch (error) {
		console.error('[SERVER] Error fetching content from Plone:', error);
		// Return minimal fallback data
		return {
			title: 'Error loading content',
			'@id': currentPath,
			blocks: {},
			blocks_layout: { items: [] },
			listingData: {},
			listingPages: {},
			paginatedBlockCount: 0,
			navigation,
			siteSettings,
			currentLang: siteSettings.defaultLanguage,
			translations: []
		};
	}

	// Extract translations from content data
	/** @type {Array<{language: string, '@id': string}>} */
	const translations = extractTranslations(data);

	// Determine current language from URL path (for UI display)
	// This shows which language version the user is currently viewing
	const pathLang = extractLanguageFromPath('/' + currentPath, siteSettings.availableLanguages);

	// Fall back to cookie/header detection if path doesn't contain a language
	const cookieLang = getLanguageCookie(event.cookies);
	const acceptLanguageHeader = event.request.headers.get('Accept-Language');
	const detectedLang = detectLanguageFromHeaders(
		cookieLang,
		acceptLanguageHeader,
		siteSettings.availableLanguages,
		siteSettings.useRequestNegotiation,
		siteSettings.defaultLanguage
	);

	// Use path-based language if available, otherwise fall back to detected
	const currentLang = pathLang || detectedLang;
	console.log(
		'[SERVER] Current language:',
		currentLang,
		'(from path:',
		pathLang,
		', detected:',
		detectedLang,
		')'
	);

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
		// Use Promise.all with individual try-catch for better error isolation
		const fetchPromises = allListingBlocks.map(async ({ blockId, blockData }) => {
			// Parse block-specific page from URL
			const blockPage = parsePageFromUrlForBlock(event.url, blockId, paginatedBlockCount);
			listingPages[blockId] = blockPage;

			if (blockData.querystring?.query?.length > 0) {
				const batchSize = blockData.b_size || blockData.querystring?.b_size || DEFAULT_BATCH_SIZE;
				const bStart = (blockPage - 1) * batchSize;

				try {
					listingData[blockId] = await fetchListingData(
						blockData.querystring,
						bStart,
						batchSize,
						API_PATH
					);
				} catch (error) {
					console.error(`Error fetching listing data for block ${blockId}:`, error);
					listingData[blockId] = { items: [], total: 0, batching: {} };
				}
			}
		});

		await Promise.all(fetchPromises);
		console.log('[SERVER] All listing data fetched');
	}

	console.log('[SERVER] Returning data');
	return {
		...data,
		listingData,
		listingPages,
		paginatedBlockCount,
		navigation,
		siteSettings,
		currentLang,
		translations
	};
}
