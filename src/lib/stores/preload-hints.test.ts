import { describe, test, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { preloadHints, addPreloadHint, type PreloadHint } from './preload-hints';

describe('Preload Hints Store', () => {
	beforeEach(() => {
		preloadHints.reset();
	});

	test('preload store accepts and stores preload hint data', () => {
		const hint: PreloadHint = {
			srcset: '/images/hero-800.jpg 800w, /images/hero-1200.jpg 1200w',
			sizes: '100vw',
			src: '/images/hero.jpg'
		};

		preloadHints.addHint(hint);
		const hints = get(preloadHints);

		expect(hints).toHaveLength(1);
		expect(hints[0]).toEqual(hint);
	});

	test('multiple preload hints store correctly', () => {
		const hint1: PreloadHint = {
			srcset: '/images/hero-800.jpg 800w',
			sizes: '100vw',
			src: '/images/hero.jpg'
		};

		const hint2: PreloadHint = {
			srcset: '/images/teaser-400.jpg 400w',
			sizes: '50vw',
			src: '/images/teaser.jpg'
		};

		preloadHints.addHint(hint1);
		preloadHints.addHint(hint2);

		const hints = get(preloadHints);
		expect(hints).toHaveLength(2);
		expect(hints[0]).toEqual(hint1);
		expect(hints[1]).toEqual(hint2);
	});

	test('prevents duplicate preload hints by src', () => {
		const hint1: PreloadHint = {
			srcset: '/images/hero-800.jpg 800w',
			sizes: '100vw',
			src: '/images/hero.jpg'
		};

		const hint2: PreloadHint = {
			srcset: '/images/hero-1200.jpg 1200w',
			sizes: '100vw',
			src: '/images/hero.jpg'
		};

		preloadHints.addHint(hint1);
		preloadHints.addHint(hint2);

		const hints = get(preloadHints);
		expect(hints).toHaveLength(1);
		expect(hints[0]).toEqual(hint1);
	});

	test('addPreloadHint helper adds hint to store', () => {
		addPreloadHint(
			'/images/image-800.jpg 800w, /images/image-1200.jpg 1200w',
			'(max-width: 768px) 100vw, 50vw',
			'/images/image.jpg'
		);

		const hints = get(preloadHints);
		expect(hints).toHaveLength(1);
		expect(hints[0]).toEqual({
			srcset: '/images/image-800.jpg 800w, /images/image-1200.jpg 1200w',
			sizes: '(max-width: 768px) 100vw, 50vw',
			src: '/images/image.jpg'
		});
	});

	test('reset clears all hints', () => {
		addPreloadHint('/images/a.jpg 800w', '100vw', '/images/a.jpg');
		addPreloadHint('/images/b.jpg 800w', '100vw', '/images/b.jpg');

		expect(get(preloadHints)).toHaveLength(2);

		preloadHints.reset();

		expect(get(preloadHints)).toHaveLength(0);
	});
});
