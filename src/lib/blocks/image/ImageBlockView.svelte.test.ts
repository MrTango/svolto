import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import ImageBlockView from './ImageBlockView.svelte';

describe('ImageBlockView - ResponsiveImage Integration', () => {
	test('renders ResponsiveImage component with picture/source/img structure', () => {
		const data = {
			url: '/Plone/my-page',
			alt: 'A sample image',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image/fullsize',
						width: 1000,
						height: 750,
						scales: {
							large: { download: '@@images/image-768.jpeg', width: 768, height: 576 },
							mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 },
							preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 }
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify picture element is rendered (from ResponsiveImage)
		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		const source = container.querySelector('picture source');
		expect(source).toBeInTheDocument();
		expect(source).toHaveAttribute('srcset');

		const img = container.querySelector('picture img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('alt', 'A sample image');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	test('passes correct props from block data to ResponsiveImage', () => {
		const data = {
			url: '/Plone/my-page',
			alt: 'Test alt text',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image/fullsize',
						width: 800,
						height: 600,
						scales: {
							large: { download: '@@images/image-768.jpeg', width: 768, height: 576 },
							mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 }
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify srcset is constructed correctly from scales
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		// Check that srcset contains width descriptors for each scale
		expect(srcset).toContain('768w');
		expect(srcset).toContain('200w');

		// Check that paths are constructed correctly with baseUrl
		expect(srcset).toContain('/Plone/my-page/@@images/image-768.jpeg');
		expect(srcset).toContain('/Plone/my-page/@@images/image-200.jpeg');

		// Verify alt text is passed correctly
		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('alt', 'Test alt text');
	});

	test('wrapper element preserves existing CSS classes', () => {
		const data = {
			url: '/Plone/my-page',
			alt: 'Image with wrapper',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image/fullsize',
						width: 1000,
						height: 750,
						scales: {
							large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify wrapper element has both 'block' and 'image' classes
		const wrapper = container.querySelector('p.block.image');
		expect(wrapper).toBeInTheDocument();

		// Verify picture element is inside the wrapper
		const picture = wrapper?.querySelector('picture');
		expect(picture).toBeInTheDocument();
	});
});

describe('ImageBlockView - URL Normalization', () => {
	test('normalizes full backend URL to relative path', () => {
		const data = {
			url: 'http://backend:8080/Plone/sample-page/dsc06510.jpg',
			alt: 'Test image',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image-6000-9f2714661f74b52a048cd4527cceaabb.jpeg',
						width: 6000,
						height: 4000,
						scales: {
							large: {
								download: '@@images/image-800-940a49bb3ee23258d757cc277420adf1.jpeg',
								width: 800,
								height: 533
							}
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify srcset does NOT contain internal hostname
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		expect(srcset).not.toContain('backend:8080');
		expect(srcset).not.toContain('http://backend');
		expect(srcset).toContain('/Plone/sample-page/dsc06510.jpg');

		// Verify img src also does NOT contain internal hostname
		const img = container.querySelector('picture img');
		const src = img?.getAttribute('src') || '';

		expect(src).not.toContain('backend:8080');
		expect(src).not.toContain('http://backend');
		expect(src).toContain('/Plone/sample-page/dsc06510.jpg');
	});

	test('handles already-relative URLs', () => {
		const data = {
			url: '/Plone/my-page/image.jpg',
			alt: 'Relative URL image',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image/fullsize',
						width: 800,
						height: 600,
						scales: {
							large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Should still work with relative URLs
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		expect(srcset).toContain('/Plone/my-page/image.jpg/@@images/image-768.jpeg');
	});

	test('normalizes localhost URLs', () => {
		const data = {
			url: 'http://localhost:8080/Plone/test/image.png',
			alt: 'Localhost image',
			download: '@@images/image/fullsize',
			image_scales: {
				image: [
					{
						download: '@@images/image/fullsize',
						width: 500,
						height: 400,
						scales: {
							mini: { download: '@@images/image-200.jpeg', width: 200, height: 160 }
						}
					}
				]
			}
		};

		const { container } = render(ImageBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		expect(srcset).not.toContain('localhost:8080');
		expect(srcset).not.toContain('http://localhost');
		expect(srcset).toContain('/Plone/test/image.png');
	});
});
