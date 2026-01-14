import { describe, test, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { preloadHints, addPreloadHint } from '$lib/stores/preload-hints';

vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn((fn) => {
			fn({ params: { path: '' } });
			return () => {};
		})
	}
}));

vi.mock('$app/navigation', () => ({
	beforeNavigate: vi.fn()
}));

describe('Preload Link Infrastructure', () => {
	beforeEach(() => {
		preloadHints.reset();
	});

	test('preload links render with correct attributes', () => {
		addPreloadHint(
			'/images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w',
			'100vw',
			'/images/hero.jpg'
		);

		const hints = get(preloadHints);
		expect(hints).toHaveLength(1);

		const hint = hints[0];
		expect(hint.srcset).toBe('/images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w');
		expect(hint.sizes).toBe('100vw');
		expect(hint.src).toBe('/images/hero.jpg');
	});

	test('imagesrcset and imagesizes attributes are set correctly', () => {
		addPreloadHint(
			'/Plone/page/@@images/image-768.jpeg 768w, /Plone/page/@@images/image-1200.jpeg 1200w',
			'(max-width: 768px) 100vw, 50vw',
			'/Plone/page/@@images/image.jpeg'
		);

		const hints = get(preloadHints);
		const hint = hints[0];

		expect(hint.srcset).toContain('768w');
		expect(hint.srcset).toContain('1200w');
		expect(hint.sizes).toBe('(max-width: 768px) 100vw, 50vw');
	});

	test('multiple preload hints render correctly', () => {
		addPreloadHint('/images/hero.jpg 1200w', '100vw', '/images/hero.jpg');
		addPreloadHint('/images/teaser.jpg 600w', '50vw', '/images/teaser.jpg');
		addPreloadHint('/images/card.jpg 400w', '33vw', '/images/card.jpg');

		const hints = get(preloadHints);
		expect(hints).toHaveLength(3);

		expect(hints[0].src).toBe('/images/hero.jpg');
		expect(hints[1].src).toBe('/images/teaser.jpg');
		expect(hints[2].src).toBe('/images/card.jpg');
	});
});
