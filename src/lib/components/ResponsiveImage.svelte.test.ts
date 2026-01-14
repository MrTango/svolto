import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ResponsiveImage from './ResponsiveImage.svelte';

describe('ResponsiveImage - Srcset Generation', () => {
	test('generates srcset from scales object with correct format', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 },
			mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 },
			preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image'
			}
		});

		const source = container.querySelector('picture source');
		expect(source).toBeInTheDocument();

		const srcset = source?.getAttribute('srcset') || '';
		// Check that srcset contains width descriptors for each scale
		expect(srcset).toContain('768w');
		expect(srcset).toContain('200w');
		expect(srcset).toContain('400w');
		// Check that paths are constructed correctly with baseUrl
		expect(srcset).toContain('/Plone/my-page/@@images/image-768.jpeg');
		expect(srcset).toContain('/Plone/my-page/@@images/image-200.jpeg');
	});

	test('generates srcset correctly with single scale entry', () => {
		const scales = {
			preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Single scale image'
			}
		});

		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		// Single scale should produce single srcset entry without trailing comma
		expect(srcset).toBe('/Plone/my-page/@@images/image-400.jpeg 400w');
	});
});

describe('ResponsiveImage - Picture Element Structure', () => {
	test('renders picture with source and img elements', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				src: '/Plone/my-page/@@images/image.jpeg'
			}
		});

		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		const source = container.querySelector('picture source');
		expect(source).toBeInTheDocument();
		expect(source).toHaveAttribute('srcset');
		expect(source).toHaveAttribute('sizes');

		const img = container.querySelector('picture img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src');
		expect(img).toHaveAttribute('alt', 'Test image');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	test('applies width and height attributes to img for CLS prevention', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				width: 800,
				height: 600
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('width', '800');
		expect(img).toHaveAttribute('height', '600');
	});

	test('applies custom class prop to img element', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				class: 'custom-image-class'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveClass('custom-image-class');
	});
});

describe('ResponsiveImage - Sizes Attribute', () => {
	test('uses default sizes value of 100vw', () => {
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

		const source = container.querySelector('picture source');
		expect(source).toHaveAttribute('sizes', '100vw');
	});

	test('applies custom sizes prop for responsive hints', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				sizes: '(max-width: 768px) 100vw, 50vw'
			}
		});

		const source = container.querySelector('picture source');
		expect(source).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
	});
});

describe('ResponsiveImage - Loading Attribute', () => {
	test('uses lazy loading by default', () => {
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

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	test('allows loading="eager" override for above-fold images', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Hero image',
				loading: 'eager'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('loading', 'eager');
	});
});

describe('ResponsiveImage - Alt Text Accessibility', () => {
	test('applies alt prop to img element', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'A beautiful sunset over the ocean'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('alt', 'A beautiful sunset over the ocean');
	});

	test('allows empty alt string for decorative images', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: ''
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('alt', '');
	});
});

describe('ResponsiveImage - Empty/Missing Scales Handling', () => {
	test('handles empty scales object gracefully', () => {
		const { container } = render(ResponsiveImage, {
			props: {
				scales: {},
				baseUrl: '/Plone/my-page',
				alt: 'Test image'
			}
		});

		// Component should still render without errors
		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		// Source srcset should be empty or the component should handle it
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).toBe('');
	});

	test('handles undefined scales gracefully', () => {
		const { container } = render(ResponsiveImage, {
			props: {
				scales: undefined as unknown as Record<string, { download: string; width: number }>,
				baseUrl: '/Plone/my-page',
				alt: 'Test image'
			}
		});

		// Component should still render without errors
		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();
	});
});

// Task 2.1: New tests for ResponsiveImage enhancements
describe('ResponsiveImage - Fetchpriority Prop', () => {
	test('renders fetchpriority attribute with correct value', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Hero image',
				fetchpriority: 'high'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('fetchpriority', 'high');
	});

	test('uses default fetchpriority="auto" when not specified', () => {
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

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('fetchpriority', 'auto');
	});
});

describe('ResponsiveImage - Decoding Prop', () => {
	test('renders decoding attribute with correct value', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				decoding: 'sync'
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('decoding', 'sync');
	});

	test('uses default decoding="async" when not specified', () => {
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

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('decoding', 'async');
	});
});

describe('ResponsiveImage - CSS Custom Properties for Placeholder', () => {
	test('applies --aspect-ratio CSS custom property to container', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				width: 800,
				height: 600
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveStyle('--aspect-ratio: 800 / 600');
	});

	test('applies --image-placeholder-bg CSS variable to container', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				width: 800,
				height: 600
			}
		});

		const wrapper = container.querySelector('.responsive-image-container');
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveStyle('--image-placeholder-bg: #e5e5e5');
	});
});

describe('ResponsiveImage - Onload Handler', () => {
	test('triggers onload callback when image loads', async () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};
		const onloadHandler = vi.fn();

		const { container } = render(ResponsiveImage, {
			props: {
				scales,
				baseUrl: '/Plone/my-page',
				alt: 'Test image',
				onload: onloadHandler
			}
		});

		const img = container.querySelector('picture img');
		expect(img).toBeInTheDocument();

		// Simulate image load event
		await fireEvent.load(img!);

		expect(onloadHandler).toHaveBeenCalledTimes(1);
	});
});
