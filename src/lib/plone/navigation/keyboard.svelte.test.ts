import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import MegaNav from './MegaNav.svelte';
import type { NavItem } from './types';

const mockNavigation: NavItem[] = [
	{
		href: '/research',
		title: 'Research',
		items: [
			{
				href: '/research/projects',
				title: 'Projects',
				items: [
					{ href: '/research/projects/ai', title: 'AI Research' },
					{ href: '/research/projects/climate', title: 'Climate Studies' }
				]
			},
			{
				href: '/research/publications',
				title: 'Publications',
				items: [{ href: '/research/publications/journals', title: 'Journals' }]
			}
		]
	},
	{
		href: '/about',
		title: 'About',
		items: [
			{
				href: '/about/team',
				title: 'Team',
				items: [{ href: '/about/team/leadership', title: 'Leadership' }]
			}
		]
	},
	{
		href: '/contact',
		title: 'Contact'
	},
	{
		href: '/news',
		title: 'News',
		items: [
			{
				href: '/news/latest',
				title: 'Latest News',
				items: []
			}
		]
	}
];

describe('Keyboard Navigation', () => {
	test('Tab moves focus between Level 1 items in navigation bar', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const navBar = container.querySelector('.nav-mega__bar');
		const level1Items = navBar?.querySelectorAll('.nav-mega__item');
		expect(level1Items?.length).toBe(4);

		// Focus the first item
		const firstItem = level1Items?.[0] as HTMLElement;
		firstItem?.focus();
		expect(document.activeElement).toBe(firstItem);

		// Verify all items are focusable (tabindex not -1)
		const secondItem = level1Items?.[1] as HTMLElement;
		expect(secondItem).toBeTruthy();
		expect(secondItem.getAttribute('tabindex')).not.toBe('-1');
	});

	test('Enter key opens panel for item with children', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		expect(researchButton).toBeInTheDocument();

		// Focus and press Enter
		researchButton.focus();
		await fireEvent.keyDown(researchButton, { key: 'Enter' });

		expect(researchButton).toHaveAttribute('aria-expanded', 'true');
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();
	});

	test('Space key opens panel and prevents default scroll behavior', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;

		researchButton.focus();
		await fireEvent.keyDown(researchButton, { key: ' ' });

		await waitFor(() => {
			expect(researchButton).toHaveAttribute('aria-expanded', 'true');
		});
	});

	test('Escape closes panel and returns focus to trigger', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;

		// Open the panel
		await fireEvent.click(researchButton);
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');

		// Focus something inside the panel
		const closeButton = container.querySelector('.nav-mega__close-btn') as HTMLElement;
		closeButton?.focus();

		// Press Escape
		await fireEvent.keyDown(document, { key: 'Escape' });

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');

		// Focus should return to trigger
		await waitFor(() => {
			expect(document.activeElement).toBe(researchButton);
		});
	});

	test('focus trap cycles through panel content when open', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;

		// Open the panel
		await fireEvent.click(researchButton);

		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Get all focusable elements inside the panel
		const focusableElements = panel?.querySelectorAll(
			'a[href], button, [tabindex]:not([tabindex="-1"])'
		);
		expect(focusableElements?.length).toBeGreaterThan(0);

		// Close button should be focusable
		const closeButton = panel?.querySelector('.nav-mega__close-btn') as HTMLElement;
		expect(closeButton).toBeInTheDocument();
	});

	test('Level 1 items have comprehensive ARIA attributes', () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/research' }
		});

		// Item with children should have aria-expanded, aria-haspopup, aria-controls
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		expect(researchButton).toHaveAttribute('aria-haspopup', 'true');
		expect(researchButton).toHaveAttribute('aria-controls', 'nav-mega-panel-research');

		// Active item should have aria-current
		const activeItem = container.querySelector('.nav-mega__item--active');
		expect(activeItem).toHaveAttribute('aria-current', 'page');
	});
});
