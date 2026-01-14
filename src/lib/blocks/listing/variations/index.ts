import type { Component } from 'svelte';
import DefaultVariation from './DefaultVariation.svelte';
import SummaryVariation from './SummaryVariation.svelte';
import type { VariationProps } from '../types';

/**
 * Type for synchronous variation components
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SyncVariation = Component<any>;

/**
 * Type for async variation loader function (dynamic import)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncVariationLoader = () => Promise<{ default: Component<any> }>;

/**
 * Union type for variation registry entries
 */
type VariationEntry = SyncVariation | AsyncVariationLoader;

/**
 * Variation registry mapping variation names to their components or loaders.
 *
 * Sync variations (common, lightweight):
 * - default: DefaultVariation - simple list of links
 * - summary: SummaryVariation - card grid layout
 *
 * Async variations (heavy dependencies):
 * - imageGallery: ImageGalleryVariation - carousel with Embla (610 lines + Embla deps)
 */
export const variationRegistry: Record<string, VariationEntry> = {
	default: DefaultVariation,
	summary: SummaryVariation,
	imageGallery: () => import('./ImageGalleryVariation.svelte')
};

/**
 * List of variations that use dynamic imports
 */
const asyncVariations = new Set(['imageGallery']);

/**
 * Check if a variation uses dynamic import
 */
export function isAsyncVariation(variation: string): boolean {
	return asyncVariations.has(variation);
}

/**
 * Get the appropriate variation component for a given variation name.
 * Returns the DefaultVariation if no matching variation is found.
 *
 * This function handles both synchronous and asynchronous (dynamically imported)
 * variation components. Heavy variations like ImageGalleryVariation are lazy-loaded
 * to reduce initial bundle size.
 *
 * @param variation - The variation name (e.g., 'default', 'summary', 'imageGallery')
 * @returns Promise resolving to the variation component to use for rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVariationComponent(variation: string | undefined): Promise<Component<any>> {
	if (!variation) {
		return DefaultVariation;
	}

	const entry = variationRegistry[variation];

	if (!entry) {
		return DefaultVariation;
	}

	// Check if this is an async loader function
	if (isAsyncVariation(variation)) {
		try {
			const module = await (entry as AsyncVariationLoader)();
			return module.default;
		} catch (error) {
			console.error(`Failed to load variation "${variation}":`, error);
			return DefaultVariation;
		}
	}

	// Synchronous variation - return directly
	return entry as SyncVariation;
}

export { DefaultVariation, SummaryVariation };
export type { VariationProps };
