import type { Component } from 'svelte';
import DefaultVariation from './DefaultVariation.svelte';
import HorizontalVariation from './HorizontalVariation.svelte';
import type { TocVariationProps } from '../types';

/**
 * Variation registry mapping variation names to their components.
 * Follows the same pattern as listing block variations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const variationRegistry: Record<string, Component<any>> = {
	default: DefaultVariation,
	horizontalMenu: HorizontalVariation
};

/**
 * Get the appropriate variation component for a given variation name.
 * Returns the DefaultVariation if no matching variation is found.
 *
 * @param variation - The variation name (e.g., 'default', 'horizontalMenu')
 * @returns The variation component to use for rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVariationComponent(variation: string | undefined): Component<any> {
	if (!variation) {
		return DefaultVariation;
	}

	return variationRegistry[variation] || DefaultVariation;
}

export { DefaultVariation, HorizontalVariation };
export type { TocVariationProps as VariationProps };
