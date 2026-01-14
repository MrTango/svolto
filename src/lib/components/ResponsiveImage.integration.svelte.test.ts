/**
 * @vitest-environment jsdom
 */
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ResponsiveImage from './ResponsiveImage.svelte';

describe('ResponsiveImage - Aspect Ratio Edge Cases', () => {
	test('handles missing width/height gracefully (no aspect ratio set)', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image'
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).toBeInTheDocument();
		const style = wrapper?.getAttribute('style') || '';
		expect(style).not.toContain('--aspect-ratio: undefined');
	});

	test('calculates aspect ratio correctly for various dimensions', () => {
		const scales = {
			large: { download: '@@images/image.jpeg', width: 1920, height: 1080 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/page',
				alt: 'Widescreen image',
				width: 1920,
				height: 1080
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).toHaveStyle('--aspect-ratio: 1920 / 1080');
	});

	test('calculates aspect ratio for square images', () => {
		const scales = {
			large: { download: '@@images/image.jpeg', width: 500, height: 500 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/page',
				alt: 'Square image',
				width: 500,
				height: 500
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).toHaveStyle('--aspect-ratio: 500 / 500');
	});
});

describe('ResponsiveImage - Placeholder Background Removal on Load', () => {
	test('container has loaded class after image load event', async () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				width: 768,
				height: 576
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).not.toHaveClass('loaded');

		const img = container.querySelector('picture img');
		await fireEvent.load(img!);

		expect(wrapper).toHaveClass('loaded');
	});

	test('placeholder background removed after load via CSS class', async () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				width: 768,
				height: 576
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');

		// Before load: has placeholder-bg style but not loaded class
		expect(wrapper).toHaveStyle('--image-placeholder-bg: #e5e5e5');
		expect(wrapper).not.toHaveClass('loaded');

		const img = container.querySelector('picture img');
		await fireEvent.load(img!);

		// After load: has loaded class which removes background via CSS
		expect(wrapper).toHaveClass('loaded');
	});
});

describe('ResponsiveImage - Srcset Generation Edge Cases', () => {
	test('srcset entries are sorted by width in ascending order', () => {
		const scales = {
			large: { download: '@@images/image-800.jpeg', width: 800, height: 600 },
			mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 },
			preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 },
			huge: { download: '@@images/image-1600.jpeg', width: 1600, height: 1200 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/page',
				alt: 'Multi-scale image'
			}
		});

		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		// All widths should be present
		expect(srcset).toContain('200w');
		expect(srcset).toContain('400w');
		expect(srcset).toContain('800w');
		expect(srcset).toContain('1600w');
	});

	test('srcset handles scales with special characters in download paths', () => {
		const scales = {
			large: { download: '@@images/image-800-abc123def456.jpeg', width: 800, height: 600 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Image with hash'
			}
		});

		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		expect(srcset).toContain('@@images/image-800-abc123def456.jpeg 800w');
	});
});

describe('ResponsiveImage - Class Prop Pass-through', () => {
	test('multiple CSS classes pass through to img element', () => {
		const scales = {
			large: { download: '@@images/image.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/page',
				alt: 'Test',
				class: 'custom-class another-class third-class'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveClass('custom-class');
		expect(img).toHaveClass('another-class');
		expect(img).toHaveClass('third-class');
	});
});
