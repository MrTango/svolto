/**
 * TypeScript interfaces for the Navigation Mega Menu
 *
 * These types define the structure for multi-level navigation data
 * from the Plone REST API @navigation endpoint.
 */

/**
 * A single navigation item with optional nested children
 * Supports recursive structure for multi-level navigation
 */
export interface NavItem {
	/** URL path for the navigation item */
	href: string;
	/** Display title for the navigation item */
	title: string;
	/** Nested child navigation items */
	items?: NavItem[];
}

/**
 * Navigation level identifier
 * Level 1: Top-level navigation bar items
 * Level 2: Column headers in mega menu
 * Level 3: Links listed under Level 2 headers
 */
export type NavLevel = 1 | 2 | 3;

/**
 * Raw navigation item from Plone API response
 * The @navigation endpoint returns @id instead of href
 */
export interface PloneNavItem {
	/** Full URL of the content item */
	'@id': string;
	/** Display title */
	title: string;
	/** Nested child items */
	items?: PloneNavItem[];
}

/**
 * Response structure from Plone @navigation endpoint
 */
export interface NavigationResponse {
	/** Root URL */
	'@id': string;
	/** Array of top-level navigation items */
	items: PloneNavItem[];
}

/**
 * Transformed navigation data for use in components
 */
export interface NavigationData {
	/** Array of top-level navigation items with transformed hrefs */
	items: NavItem[];
}
