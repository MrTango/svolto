import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import ImageGalleryVariation from './ImageGalleryVariation.svelte';
import type { ListingItem } from '../types';

/**
 * Task Group 5: Image Gallery Variation Tests
 *
 * These tests verify the core functionality of the ImageGalleryVariation component:
 * 1. Filters items to only show Image content types
 * 2. Renders gallery with navigation controls
 * 3. Handles empty gallery (no images) gracefully
 */
describe('ImageGalleryVariation', () => {
	// Test data with Image content types
	const mockImageItems: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/images/image-1',
			'@type': 'Image',
			title: 'First Image',
			description: 'Description for the first image',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image-1200x800.jpeg',
						width: 1200,
						height: 800,
						scales: {
							mini: { download: '@@images/image-200x133.jpeg', width: 200, height: 133 },
							preview: { download: '@@images/image-400x267.jpeg', width: 400, height: 267 },
							large: { download: '@@images/image-800x533.jpeg', width: 800, height: 533 },
							thumb: { download: '@@images/image-128x85.jpeg', width: 128, height: 85 }
						}
					}
				]
			}
		},
		{
			'@id': 'http://localhost:8080/Plone/images/image-2',
			'@type': 'Image',
			title: 'Second Image',
			description: 'Description for the second image',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image-1024x768.jpeg',
						width: 1024,
						height: 768,
						scales: {
							mini: { download: '@@images/image-200x150.jpeg', width: 200, height: 150 },
							preview: { download: '@@images/image-400x300.jpeg', width: 400, height: 300 },
							thumb: { download: '@@images/image-128x96.jpeg', width: 128, height: 96 }
						}
					}
				]
			}
		},
		{
			'@id': 'http://localhost:8080/Plone/images/image-3',
			'@type': 'Image',
			title: 'Third Image',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image-800x600.jpeg',
						width: 800,
						height: 600,
						scales: {
							mini: { download: '@@images/image-200x150.jpeg', width: 200, height: 150 },
							thumb: { download: '@@images/image-128x96.jpeg', width: 128, height: 96 }
						}
					}
				]
			}
		}
	];

	// Mixed items (Images and other content types)
	const mixedItems: ListingItem[] = [
		...mockImageItems,
		{
			'@id': 'http://localhost:8080/Plone/news/article-1',
			'@type': 'News Item',
			title: 'News Article',
			description: 'This is a news article, not an image'
		},
		{
			'@id': 'http://localhost:8080/Plone/documents/doc-1',
			'@type': 'Document',
			title: 'Document',
			description: 'This is a document'
		}
	];

	// Items with no Image types
	const nonImageItems: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/news/article-1',
			'@type': 'News Item',
			title: 'News Article',
			description: 'This is a news article'
		},
		{
			'@id': 'http://localhost:8080/Plone/documents/doc-1',
			'@type': 'Document',
			title: 'Document',
			description: 'This is a document'
		}
	];

	test('filters items to only show Image content types', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: mixedItems }
		});

		// Should render the gallery container
		const gallery = container.querySelector('.listing-gallery');
		expect(gallery).toBeInTheDocument();

		// Should only show 3 slides (the Image types, not News Item or Document)
		const slides = container.querySelectorAll('.gallery-slide');
		expect(slides).toHaveLength(3);

		// Check that only Image items are rendered
		// The slides should have images with src attributes containing image paths
		const images = container.querySelectorAll('.gallery-slide picture img');
		expect(images).toHaveLength(3);

		// Verify image paths don't include /Plone prefix (should be stripped)
		const imgSrc = images[0].getAttribute('src');
		expect(imgSrc).not.toContain('/Plone');
		expect(imgSrc).toMatch(/^\/images\/image-1\/@@images\//);
	});

	test('renders gallery with navigation controls', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: mockImageItems }
		});

		// Should render prev and next navigation buttons
		const prevButton = container.querySelector('.gallery-nav-prev');
		const nextButton = container.querySelector('.gallery-nav-next');
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();

		// Should render thumbnail navigation
		const thumbnails = container.querySelectorAll('.gallery-thumbnail');
		expect(thumbnails).toHaveLength(3);

		// Should render fullscreen button
		const fullscreenButton = container.querySelector('.gallery-fullscreen-btn');
		expect(fullscreenButton).toBeInTheDocument();
	});

	test('handles empty gallery (no images) gracefully', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: nonImageItems }
		});

		// Should render empty state message
		const emptyState = container.querySelector('.gallery-empty');
		expect(emptyState).toBeInTheDocument();

		// Should not render navigation or thumbnails when no images
		const prevButton = container.querySelector('.gallery-nav-prev');
		const nextButton = container.querySelector('.gallery-nav-next');
		const thumbnails = container.querySelectorAll('.gallery-thumbnail');

		expect(prevButton).not.toBeInTheDocument();
		expect(nextButton).not.toBeInTheDocument();
		expect(thumbnails).toHaveLength(0);
	});
});

/**
 * Task 4.1: Component Migration Tests for ResponsiveImage
 *
 * These tests verify the migration of ImageGalleryVariation to use ResponsiveImage:
 * 1. First carousel image has fetchpriority="high"
 * 2. Subsequent carousel images have loading="lazy"
 * 3. Thumbnails remain as simple img tags
 */
describe('ImageGalleryVariation - ResponsiveImage Migration', () => {
	const mockImageItems: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/images/image-1',
			'@type': 'Image',
			title: 'First Image',
			description: 'First image description',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image.jpeg',
						width: 1200,
						height: 800,
						alt: 'First image alt',
						scales: {
							preview: { download: '@@images/image-400.jpeg', width: 400, height: 267 },
							large: { download: '@@images/image-800.jpeg', width: 800, height: 533 },
							thumb: { download: '@@images/image-128.jpeg', width: 128, height: 85 }
						}
					}
				]
			}
		},
		{
			'@id': 'http://localhost:8080/Plone/images/image-2',
			'@type': 'Image',
			title: 'Second Image',
			description: 'Second image description',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image.jpeg',
						width: 1000,
						height: 750,
						alt: 'Second image alt',
						scales: {
							preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 },
							large: { download: '@@images/image-800.jpeg', width: 800, height: 600 },
							thumb: { download: '@@images/image-128.jpeg', width: 128, height: 96 }
						}
					}
				]
			}
		},
		{
			'@id': 'http://localhost:8080/Plone/images/image-3',
			'@type': 'Image',
			title: 'Third Image',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image.jpeg',
						width: 900,
						height: 600,
						scales: {
							preview: { download: '@@images/image-400.jpeg', width: 400, height: 267 },
							large: { download: '@@images/image-800.jpeg', width: 800, height: 533 }
						}
					}
				]
			}
		}
	];

	test('first carousel image has fetchpriority="high"', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: mockImageItems }
		});

		// Get all gallery slides
		const slides = container.querySelectorAll('.gallery-slide');
		expect(slides.length).toBeGreaterThan(0);

		// First slide should have an image with fetchpriority="high"
		const firstSlide = slides[0];
		const firstImg = firstSlide.querySelector('picture img');
		expect(firstImg).toHaveAttribute('fetchpriority', 'high');
	});

	test('subsequent carousel images have loading="lazy"', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: mockImageItems }
		});

		const slides = container.querySelectorAll('.gallery-slide');
		expect(slides.length).toBeGreaterThanOrEqual(2);

		// Second and subsequent slides should have loading="lazy"
		for (let i = 1; i < slides.length; i++) {
			const img = slides[i].querySelector('picture img');
			expect(img).toHaveAttribute('loading', 'lazy');
		}
	});

	test('thumbnails remain as simple img tags with loading="lazy"', () => {
		const { container } = render(ImageGalleryVariation, {
			props: { items: mockImageItems }
		});

		// Thumbnails should be simple img tags, not wrapped in responsive-image-container
		const thumbnails = container.querySelectorAll('.gallery-thumbnail .thumbnail-image');
		expect(thumbnails.length).toBeGreaterThan(0);

		thumbnails.forEach((thumb) => {
			expect(thumb).toHaveAttribute('loading', 'lazy');
			// Thumbnail should NOT be inside a responsive-image-container (it's a simple img)
			const parent = thumb.closest('.responsive-image-container');
			expect(parent).toBeNull();
		});
	});
});
