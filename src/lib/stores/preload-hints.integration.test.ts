import { describe, test, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { preloadHints, addPreloadHint, type PreloadHint } from './preload-hints';

describe('Preload Hints Store - Integration with Layout', () => {
	beforeEach(() => {
		preloadHints.reset();
	});

	test('store provides data structure compatible with svelte:head iteration', () => {
		addPreloadHint(
			'/images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w',
			'100vw',
			'/images/hero.jpg'
		);
		addPreloadHint(
			'/images/teaser-400.jpg 400w',
			'50vw',
			'/images/teaser.jpg'
		);

		const hints = get(preloadHints);

		// Verify hints can be used directly in {#each} block
		expect(Array.isArray(hints)).toBe(true);
		expect(hints.length).toBe(2);

		// Each hint should have all required attributes for <link> element
		hints.forEach((hint) => {
			expect(hint).toHaveProperty('src');
			expect(hint).toHaveProperty('srcset');
			expect(hint).toHaveProperty('sizes');
			expect(typeof hint.src).toBe('string');
			expect(typeof hint.srcset).toBe('string');
			expect(typeof hint.sizes).toBe('string');
		});
	});

	test('preload hint data is suitable for link element attributes', () => {
		const srcset = '/Plone/page/@@images/image-768.jpeg 768w, /Plone/page/@@images/image-1200.jpeg 1200w';
		const sizes = '(max-width: 768px) 100vw, 50vw';
		const src = '/Plone/page/@@images/image.jpeg';

		addPreloadHint(srcset, sizes, src);

		const hints = get(preloadHints);
		const hint = hints[0];

		// Verify values can be used directly in link attributes
		// <link rel="preload" as="image" href={hint.src} imagesrcset={hint.srcset} imagesizes={hint.sizes} />
		expect(hint.src).toBe(src);
		expect(hint.srcset).toBe(srcset);
		expect(hint.sizes).toBe(sizes);
	});

	test('reset() clears hints between page navigations', () => {
		addPreloadHint('/page1/hero.jpg 800w', '100vw', '/page1/hero.jpg');
		expect(get(preloadHints)).toHaveLength(1);

		// Simulate page navigation (beforeNavigate calls reset)
		preloadHints.reset();
		expect(get(preloadHints)).toHaveLength(0);

		// New page can add new hints
		addPreloadHint('/page2/hero.jpg 800w', '100vw', '/page2/hero.jpg');
		expect(get(preloadHints)).toHaveLength(1);
		expect(get(preloadHints)[0].src).toBe('/page2/hero.jpg');
	});
});
