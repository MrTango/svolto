import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import SummaryVariation from './SummaryVariation.svelte';
import type { ListingItem, LinkHrefItem } from '../types';

/**
 * Task Group 4: Summary Variation Tests
 *
 * These tests verify the core functionality of the SummaryVariation component:
 * 1. Renders items as cards with images
 * 2. Handles items without images gracefully
 * 3. Renders title and description in each card
 */
describe('SummaryVariation', () => {
	// Test data with images
	const mockItemsWithImages: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/news/article-1',
			'@type': 'News Item',
			title: 'Article with Image',
			description: 'This article has an image',
			image_field: 'preview_image',
			image_scales: {
				preview_image: [
					{
						download: '@@images/preview_image-800x600.jpeg',
						width: 800,
						height: 600,
						scales: {
							mini: { download: '@@images/preview_image-200x150.jpeg', width: 200, height: 150 },
							preview: { download: '@@images/preview_image-400x300.jpeg', width: 400, height: 300 },
							large: { download: '@@images/preview_image-800x600.jpeg', width: 800, height: 600 }
						}
					}
				]
			}
		},
		{
			'@id': 'http://localhost:8080/Plone/news/article-2',
			'@type': 'News Item',
			title: 'Second Article with Image',
			description: 'This also has an image',
			image_field: 'image',
			image_scales: {
				image: [
					{
						download: '@@images/image-1024x768.jpeg',
						width: 1024,
						height: 768,
						scales: {
							mini: { download: '@@images/image-200x150.jpeg', width: 200, height: 150 },
							preview: { download: '@@images/image-400x300.jpeg', width: 400, height: 300 }
						}
					}
				]
			}
		}
	];

	// Test data without images
	const mockItemsWithoutImages: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/news/article-3',
			'@type': 'News Item',
			title: 'Article without Image',
			description: 'This article has no image'
		},
		{
			'@id': 'http://localhost:8080/Plone/news/article-4',
			'@type': 'News Item',
			title: 'Another No-Image Article'
			// No description either
		}
	];

	// Mixed items (some with images, some without)
	const mixedItems: ListingItem[] = [...mockItemsWithImages, ...mockItemsWithoutImages];

	test('renders items as cards with images', () => {
		const { container } = render(SummaryVariation, {
			props: { items: mockItemsWithImages }
		});

		// Should render card grid
		const grid = container.querySelector('.listing-summary-grid');
		expect(grid).toBeInTheDocument();

		// Should render 2 cards
		const cards = container.querySelectorAll('.listing-card');
		expect(cards).toHaveLength(2);

		// Each card should have an image wrapper with picture element
		const imageWrappers = container.querySelectorAll('.card-image-wrapper');
		expect(imageWrappers).toHaveLength(2);

		// Check for picture elements (from ResponsiveImage)
		const pictures = container.querySelectorAll('picture');
		expect(pictures).toHaveLength(2);

		// Check that images have proper src attributes
		const images = container.querySelectorAll('img');
		expect(images).toHaveLength(2);
		expect(images[0]).toHaveAttribute('src');
		expect(images[1]).toHaveAttribute('src');

		// Verify image paths don't include /Plone prefix (should be stripped)
		const imgSrc = images[0].getAttribute('src');
		expect(imgSrc).not.toContain('/Plone');
		expect(imgSrc).toMatch(/^\/news\/article-1\/@@images\//);
	});

	test('handles items without images gracefully', () => {
		const { container } = render(SummaryVariation, {
			props: { items: mixedItems }
		});

		// Should render all 4 cards
		const cards = container.querySelectorAll('.listing-card');
		expect(cards).toHaveLength(4);

		// Only 2 items have images, so only 2 image wrappers
		const imageWrappers = container.querySelectorAll('.card-image-wrapper');
		expect(imageWrappers).toHaveLength(2);

		// Cards without images should have no-image class
		const noImageCards = container.querySelectorAll('.listing-card.no-image');
		expect(noImageCards).toHaveLength(2);

		// Cards with images should not have no-image class
		const cardsWithImages = container.querySelectorAll('.listing-card:not(.no-image)');
		expect(cardsWithImages).toHaveLength(2);

		// All cards should still have content sections
		const contentSections = container.querySelectorAll('.card-content');
		expect(contentSections).toHaveLength(4);
	});

	test('renders title and description in each card', () => {
		const { container } = render(SummaryVariation, {
			props: { items: mixedItems }
		});

		// Should render 4 titles
		const titles = container.querySelectorAll('.card-title');
		expect(titles).toHaveLength(4);

		// Check title content and links
		const titleLinks = container.querySelectorAll('.card-title a');
		expect(titleLinks).toHaveLength(4);

		// First card
		expect(titleLinks[0]).toHaveAttribute('href', '/news/article-1');
		expect(titleLinks[0].textContent).toBe('Article with Image');

		// Second card
		expect(titleLinks[1]).toHaveAttribute('href', '/news/article-2');
		expect(titleLinks[1].textContent).toBe('Second Article with Image');

		// Third card (no image)
		expect(titleLinks[2]).toHaveAttribute('href', '/news/article-3');
		expect(titleLinks[2].textContent).toBe('Article without Image');

		// Fourth card (no image, no description)
		expect(titleLinks[3]).toHaveAttribute('href', '/news/article-4');
		expect(titleLinks[3].textContent).toBe('Another No-Image Article');

		// Should render 3 descriptions (one item has no description)
		const descriptions = container.querySelectorAll('.card-description');
		expect(descriptions).toHaveLength(3);

		expect(descriptions[0].textContent).toBe('This article has an image');
		expect(descriptions[1].textContent).toBe('This also has an image');
		expect(descriptions[2].textContent).toBe('This article has no image');
	});

	test('renders "Link More" when configured', () => {
		const linkHref: LinkHrefItem[] = [
			{
				'@id': 'http://localhost:8080/Plone/news',
				'@type': 'Folder',
				title: 'News'
			}
		];

		const { container } = render(SummaryVariation, {
			props: {
				items: mockItemsWithImages,
				linkTitle: 'View All News',
				linkHref
			}
		});

		// Should render footer with link more
		const footer = container.querySelector('.listing-footer');
		expect(footer).toBeInTheDocument();

		const linkMore = container.querySelector('a.link-more');
		expect(linkMore).toBeInTheDocument();
		expect(linkMore).toHaveAttribute('href', '/news');
		expect(linkMore?.textContent).toBe('View All News');
	});

	test('handles empty items array gracefully', () => {
		const { container } = render(SummaryVariation, {
			props: { items: [] }
		});

		// Should still render container
		const summaryContainer = container.querySelector('.listing-summary');
		expect(summaryContainer).toBeInTheDocument();

		// No cards should be rendered
		const cards = container.querySelectorAll('.listing-card');
		expect(cards).toHaveLength(0);
	});
});
