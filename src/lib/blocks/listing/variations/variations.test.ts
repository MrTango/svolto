import { describe, test, expect, vi } from 'vitest';
import {
	getVariationComponent,
	variationRegistry,
	isAsyncVariation
} from './index';
import DefaultVariation from './DefaultVariation.svelte';
import SummaryVariation from './SummaryVariation.svelte';

/**
 * Task Group 3.1: Variation Loading Tests
 *
 * These tests verify the dynamic import behavior of listing variations:
 * - DefaultVariation and SummaryVariation load synchronously (common, lightweight)
 * - ImageGalleryVariation loads dynamically (heavy, uses Embla Carousel)
 * - Unknown variations fall back to DefaultVariation
 */
describe('Listing Variations - Dynamic Import Registry', () => {
	test('DefaultVariation is registered as synchronous component', () => {
		const result = variationRegistry['default'];
		expect(result).toBe(DefaultVariation);
		expect(isAsyncVariation('default')).toBe(false);
	});

	test('SummaryVariation is registered as synchronous component', () => {
		const result = variationRegistry['summary'];
		expect(result).toBe(SummaryVariation);
		expect(isAsyncVariation('summary')).toBe(false);
	});

	test('ImageGalleryVariation is registered as async loader function', () => {
		const result = variationRegistry['imageGallery'];
		// Should be a function that returns a promise (dynamic import)
		expect(typeof result).toBe('function');
		expect(isAsyncVariation('imageGallery')).toBe(true);
	});

	test('getVariationComponent returns DefaultVariation for unknown variations', async () => {
		const result = await getVariationComponent('unknownVariation');
		expect(result).toBe(DefaultVariation);
	});

	test('getVariationComponent returns DefaultVariation for undefined input', async () => {
		const result = await getVariationComponent(undefined);
		expect(result).toBe(DefaultVariation);
	});

	test('getVariationComponent returns sync variations directly', async () => {
		const defaultResult = await getVariationComponent('default');
		expect(defaultResult).toBe(DefaultVariation);

		const summaryResult = await getVariationComponent('summary');
		expect(summaryResult).toBe(SummaryVariation);
	});

	test('getVariationComponent loads ImageGalleryVariation dynamically', async () => {
		const result = await getVariationComponent('imageGallery');
		// Should resolve to a Svelte component
		expect(result).toBeDefined();
		// The component should have the Svelte component shape
		expect(typeof result).toBe('function');
	});
});
