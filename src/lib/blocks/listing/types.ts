/**
 * TypeScript interfaces for the Listing Block
 *
 * These types match the Plone REST API structure for querystring-search results
 * and listing block configuration data.
 */

/**
 * Query criteria for Plone querystring search
 * Matches the schema from @plone/client's querystringSearchDataSchema
 */
export interface QuerystringQuery {
	/** Index name (e.g., 'portal_type', 'path', 'review_state') */
	i: string;
	/** Operation (e.g., 'plone.app.querystring.operation.selection.any') */
	o: string;
	/** Value(s) for the query */
	v: string | string[];
}

/**
 * Querystring configuration from the listing block data
 */
export interface QuerystringConfig {
	/** Array of query criteria */
	query?: QuerystringQuery[];
	/** Sort field */
	sort_on?: string;
	/** Sort order ('ascending' or 'descending') */
	sort_order?: string;
	/** Maximum results limit */
	limit?: number;
	/** Batch size (page size) */
	b_size?: number;
}

/**
 * Image scale information from Plone
 */
export interface ImageScale {
	download: string;
	width: number;
	height?: number;
}

/**
 * Image scales object keyed by scale name
 */
export interface ImageScales {
	[scaleName: string]: ImageScale;
}

/**
 * Image data from Plone content
 */
export interface ImageData {
	download: string;
	width: number;
	height: number;
	scales?: ImageScales;
	base_path?: string;
	alt?: string;
}

/**
 * A single item in the listing results
 * Represents a Plone content item with metadata
 */
export interface ListingItem {
	/** Full URL/ID of the content item */
	'@id': string;
	/** Content type (e.g., 'Document', 'News Item', 'Event', 'Image') */
	'@type': string;
	/** Content title */
	title: string;
	/** Content description/summary */
	description?: string;
	/** Review state */
	review_state?: string;
	/** Image field name (e.g., 'preview_image', 'image') */
	image_field?: string;
	/** Image scales data keyed by image field name */
	image_scales?: Record<string, ImageData[]>;
	/** Whether content has a preview image */
	hasPreviewImage?: boolean;
	/** Event start date (for Event content type) */
	start?: string;
	/** Event end date (for Event content type) */
	end?: string;
	/** Whether event is a whole day event */
	whole_day?: boolean;
	/** Event location */
	location?: string;
	/** Head title / kicker */
	head_title?: string;
	/** Creation date */
	created?: string;
	/** Modification date */
	modified?: string;
	/** Effective date (publication date) */
	effective?: string;
}

/**
 * Batching information from the API response
 */
export interface BatchingInfo {
	/** URL for the previous page */
	prev?: string;
	/** URL for the next page */
	next?: string;
	/** URL for the first page */
	first?: string;
	/** URL for the last page */
	last?: string;
}

/**
 * Response structure from the querystring-search API
 */
export interface ListingResponse {
	/** Array of content items */
	items: ListingItem[];
	/** Total number of results */
	total: number;
	/** Batching information for pagination */
	batching?: BatchingInfo;
}

/**
 * Link reference from Plone object browser widget
 */
export interface LinkHrefItem {
	'@id': string;
	'@type'?: string;
	title?: string;
}

/**
 * Listing block configuration data from Plone
 * Matches the schema defined in Volto's listing block
 */
export interface ListingBlockData {
	/** Block type identifier */
	'@type'?: string;
	/** Variation template to use ('default', 'summary', 'imageGallery') */
	variation?: string;
	/** Optional headline text */
	headline?: string;
	/** Heading level for headline ('h2' or 'h3', default: 'h2') */
	headlineTag?: 'h2' | 'h3';
	/** Query configuration */
	querystring?: QuerystringConfig;
	/** "Link More" button text */
	linkTitle?: string;
	/** "Link More" destination (array with one item from object browser) */
	linkHref?: LinkHrefItem[];
	/** Batch size (number of items per page) */
	b_size?: number;
}

/**
 * Props for variation components
 */
export interface VariationProps {
	/** Array of listing items to display */
	items: ListingItem[];
	/** "Link More" button text */
	linkTitle?: string;
	/** "Link More" destination */
	linkHref?: LinkHrefItem[];
}

/**
 * Props for the ListingBlockView component
 */
export interface ListingBlockViewProps {
	/** Unique key for the block */
	key: string;
	/** Block ID */
	id: string;
	/** Block configuration data */
	data: ListingBlockData;
	/** Page metadata */
	metadata?: Record<string, unknown>;
	/** Page properties */
	properties?: Record<string, unknown>;
	/** Current path */
	path?: string;
	/** Current page number for pagination (default: 1) */
	page?: number;
}
