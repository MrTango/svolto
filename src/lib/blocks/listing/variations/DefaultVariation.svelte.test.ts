import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import DefaultVariation from './DefaultVariation.svelte';
import type { ListingItem, LinkHrefItem } from '../types';

/**
 * Task Group 3: Default Variation Tests
 *
 * These tests verify the core functionality of the DefaultVariation component:
 * 1. Renders list of item titles as links
 * 2. Renders item descriptions when available
 * 3. Renders "Link More" when configured
 */
describe('DefaultVariation', () => {
	// Test data
	const mockItems: ListingItem[] = [
		{
			'@id': 'http://localhost:8080/Plone/news/article-1',
			'@type': 'News Item',
			title: 'First Article',
			description: 'Description for the first article'
		},
		{
			'@id': 'http://localhost:8080/Plone/news/article-2',
			'@type': 'News Item',
			title: 'Second Article',
			description: 'Description for the second article'
		},
		{
			'@id': 'http://localhost:8080/Plone/news/article-3',
			'@type': 'News Item',
			title: 'Third Article'
			// No description for this item
		}
	];

	test('renders list of item titles as links', () => {
		const { container } = render(DefaultVariation, {
			props: { items: mockItems }
		});

		// Should render a list with all items
		const list = container.querySelector('ul.listing-items');
		expect(list).toBeInTheDocument();

		const listItems = container.querySelectorAll('li.listing-item');
		expect(listItems).toHaveLength(3);

		// Each item should have a title wrapped in a link
		const links = container.querySelectorAll('a.listing-item-link');
		expect(links).toHaveLength(3);

		// Check first link
		expect(links[0]).toHaveAttribute('href', '/news/article-1');
		expect(links[0].textContent).toContain('First Article');

		// Check second link
		expect(links[1]).toHaveAttribute('href', '/news/article-2');
		expect(links[1].textContent).toContain('Second Article');

		// Check third link
		expect(links[2]).toHaveAttribute('href', '/news/article-3');
		expect(links[2].textContent).toContain('Third Article');
	});

	test('renders item descriptions when available', () => {
		const { container } = render(DefaultVariation, {
			props: { items: mockItems }
		});

		// Find all description paragraphs
		const descriptions = container.querySelectorAll('p.listing-item-description');

		// Only 2 items have descriptions
		expect(descriptions).toHaveLength(2);

		// Check the descriptions contain correct text
		expect(descriptions[0].textContent).toBe('Description for the first article');
		expect(descriptions[1].textContent).toBe('Description for the second article');

		// Third item should not have a description element
		const listItems = container.querySelectorAll('li.listing-item');
		const thirdItem = listItems[2];
		const thirdDescription = thirdItem.querySelector('p.listing-item-description');
		expect(thirdDescription).not.toBeInTheDocument();
	});

	test('renders "Link More" when configured', () => {
		const linkHref: LinkHrefItem[] = [
			{
				'@id': 'http://localhost:8080/Plone/news',
				'@type': 'Folder',
				title: 'News'
			}
		];

		const { container } = render(DefaultVariation, {
			props: {
				items: mockItems,
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

	test('does not render "Link More" when not configured', () => {
		const { container } = render(DefaultVariation, {
			props: { items: mockItems }
		});

		// Should not render footer when linkTitle is missing
		const footer = container.querySelector('.listing-footer');
		expect(footer).not.toBeInTheDocument();

		const linkMore = container.querySelector('a.link-more');
		expect(linkMore).not.toBeInTheDocument();
	});

	test('does not render "Link More" when linkHref is missing', () => {
		const { container } = render(DefaultVariation, {
			props: {
				items: mockItems,
				linkTitle: 'View All'
				// linkHref is missing
			}
		});

		// Should not render footer when linkHref is missing
		const footer = container.querySelector('.listing-footer');
		expect(footer).not.toBeInTheDocument();
	});

	test('handles empty items array gracefully', () => {
		const { container } = render(DefaultVariation, {
			props: { items: [] }
		});

		// Should still render container but list should be empty
		const listingDefault = container.querySelector('.listing-default');
		expect(listingDefault).toBeInTheDocument();

		const listItems = container.querySelectorAll('li.listing-item');
		expect(listItems).toHaveLength(0);
	});
});
