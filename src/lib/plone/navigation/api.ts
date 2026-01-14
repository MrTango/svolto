/**
 * Navigation data fetching utilities
 *
 * Provides functions for fetching navigation data from Plone's @navigation endpoint
 * with configurable depth for multi-level mega menu support.
 */

import { PUBLIC_API_PATH } from '$env/static/public';
import type { NavItem, PloneNavItem, NavigationData } from './types';

/** Default navigation depth for mega menu (3 levels) */
export const DEFAULT_NAV_DEPTH = 3;

/**
 * Transform a Plone navigation item to the internal NavItem format
 * Converts @id to href and recursively transforms child items
 *
 * @param item - Raw Plone navigation item from API
 * @param apiPath - API base path to strip from URLs
 * @returns Transformed NavItem with href instead of @id
 */
export function transformNavItem(item: PloneNavItem, apiPath: string): NavItem {
	// Convert absolute @id URL to relative href path
	let href = item['@id'];
	if (href.startsWith(apiPath)) {
		href = href.slice(apiPath.length) || '/';
	}
	// Ensure href starts with /
	if (!href.startsWith('/')) {
		href = '/' + href;
	}

	return {
		href,
		title: item.title,
		items: item.items?.map((child) => transformNavItem(child, apiPath))
	};
}

/**
 * Transform the full navigation response to NavigationData
 *
 * @param items - Array of Plone navigation items from API
 * @param apiPath - API base path to strip from URLs
 * @returns NavigationData with transformed items
 */
export function transformNavigation(items: PloneNavItem[], apiPath: string): NavigationData {
	return {
		items: items.map((item) => transformNavItem(item, apiPath))
	};
}

/**
 * Fetch navigation data from Plone's @navigation endpoint
 *
 * @param depth - Number of navigation levels to fetch (default: 3)
 * @param apiPathOverride - Optional API path for server-side use (overrides PUBLIC_API_PATH)
 * @param path - Optional context path for language-specific navigation (e.g., '/de' or '/en')
 * @returns Promise resolving to NavigationData with transformed items
 */
export async function fetchNavigation(
	depth: number = DEFAULT_NAV_DEPTH,
	apiPathOverride?: string,
	path?: string
): Promise<NavigationData> {
	const apiPath = apiPathOverride ?? PUBLIC_API_PATH ?? '';

	// Build navigation path: include language/context path if provided
	// e.g., '/de' -> '/de/@navigation', '/' or undefined -> '/@navigation'
	const navigationPath = path && path !== '/' ? path : '';

	try {
		const response = await fetch(
			`${apiPath}${navigationPath}/@navigation?expand.navigation.depth=${depth}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Navigation API request failed: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Transform the response to internal format
		return transformNavigation(data.items || [], apiPath);
	} catch (error) {
		console.error('Error fetching navigation data:', error);
		// Return empty navigation data as fallback
		return { items: [] };
	}
}
