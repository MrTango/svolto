import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import ListingItem from './ListingItem.svelte';

describe('ListingItem - ResponsiveImage Migration', () => {
	const mockItem = {
		href: '/my-content',
		title: 'Test Item Title',
		description: 'Test description text',
		image_field: 'image',
		image_scales: {
			image: [
				{
					download: '@@images/image.jpeg',
					width: 800,
					height: 600,
					scales: {
						preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 },
						mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 },
						large: { download: '@@images/image-800.jpeg', width: 800, height: 600 }
					}
				}
			]
		}
	};

	test('renders ResponsiveImage with correct props from catalogItem', () => {
		const { container } = render(ListingItem, {
			props: { item: mockItem }
		});

		// Check that ResponsiveImage is used (has responsive-image-container class)
		const imageContainer = container.querySelector('.responsive-image-container');
		expect(imageContainer).toBeInTheDocument();

		// Check that picture element is rendered
		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		// Check that srcset is generated with correct paths (no /renderimg route)
		const source = container.querySelector('picture source');
		expect(source).toBeInTheDocument();
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).toContain('/my-content/@@images/image-');
		expect(srcset).not.toContain('/renderimg');
	});

	test('does not use /renderimg route in image URLs', () => {
		const { container } = render(ListingItem, {
			props: { item: mockItem }
		});

		// Check srcset does not contain /renderimg
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).not.toContain('/renderimg');

		// Check img src does not contain /renderimg
		const img = container.querySelector('picture img');
		const src = img?.getAttribute('src') || '';
		expect(src).not.toContain('/renderimg');
	});

	test('maintains existing HTML structure and CSS classes', () => {
		const { container } = render(ListingItem, {
			props: { item: mockItem }
		});

		// Check that listingItem container exists
		const listingItem = container.querySelector('.listingItem');
		expect(listingItem).toBeInTheDocument();

		// Check textWrapper structure
		const textWrapper = container.querySelector('.textWrapper');
		expect(textWrapper).toBeInTheDocument();

		// Check imageWrapper structure
		const imageWrapper = container.querySelector('.imageWrapper');
		expect(imageWrapper).toBeInTheDocument();

		// Check title link
		const titleLink = container.querySelector('.textWrapper h2 a');
		expect(titleLink).toBeInTheDocument();
		expect(titleLink).toHaveAttribute('href', '/my-content');
		expect(titleLink).toHaveTextContent('Test Item Title');

		// Check description
		const description = container.querySelector('.textWrapper p');
		expect(description).toHaveTextContent('Test description text');
	});
});
