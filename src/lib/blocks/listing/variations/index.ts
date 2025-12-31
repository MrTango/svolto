import type { Component } from 'svelte';
import DefaultVariation from './DefaultVariation.svelte';
import SummaryVariation from './SummaryVariation.svelte';
import ImageGalleryVariation from './ImageGalleryVariation.svelte';
import type { VariationProps } from '../types';

/**
 * Variation registry mapping variation names to their components.
 * Follows the same pattern as teaser templates registry.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const variationRegistry: Record<string, Component<any>> = {
	default: DefaultVariation,
	summary: SummaryVariation,
	imageGallery: ImageGalleryVariation
};

/**
 * Get the appropriate variation component for a given variation name.
 * Returns the DefaultVariation if no matching variation is found.
 *
 * @param variation - The variation name (e.g., 'default', 'summary', 'imageGallery')
 * @returns The variation component to use for rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVariationComponent(variation: string | undefined): Component<any> {
	if (!variation) {
		return DefaultVariation;
	}

	return variationRegistry[variation] || DefaultVariation;
}

export { DefaultVariation, SummaryVariation, ImageGalleryVariation };
export type { VariationProps };
