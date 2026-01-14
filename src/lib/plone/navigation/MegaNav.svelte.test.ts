import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
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
		// No children - should navigate directly
	}
];

describe('Desktop Mega Menu', () => {
	test('Level 1 item click opens panel when item has children', async () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		// Find the Research Level 1 button (has children)
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		expect(researchButton).toBeInTheDocument();
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');

		// Click to open panel
		await fireEvent.click(researchButton!);

		// Panel should be open
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');

		// Panel element should be visible
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();
	});

	test('Level 1 item without children is a link that navigates directly', () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		// Contact has no children - should be a link, not a button
		const contactLink = container.querySelector('a.nav-mega__item[href="/contact"]');
		expect(contactLink).toBeInTheDocument();
		expect(contactLink).toHaveTextContent('Contact');

		// Should NOT have aria-expanded (not expandable)
		expect(contactLink).not.toHaveAttribute('aria-expanded');
	});

	test('only one panel open at a time', async () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		await fireEvent.click(researchButton!);
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');

		// Open About panel
		const aboutButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-about"]'
		);
		await fireEvent.click(aboutButton!);

		// About should be open, Research should be closed
		expect(aboutButton).toHaveAttribute('aria-expanded', 'true');
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');

		// Only About panel should be visible
		const researchPanel = container.querySelector('#nav-mega-panel-research');
		const aboutPanel = container.querySelector('#nav-mega-panel-about');
		expect(researchPanel).not.toBeInTheDocument();
		expect(aboutPanel).toBeInTheDocument();
	});

	test('close button closes panel', async () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		await fireEvent.click(researchButton!);

		// Find and click close button
		const closeButton = container.querySelector('.nav-mega__close-btn');
		expect(closeButton).toBeInTheDocument();
		await fireEvent.click(closeButton!);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('Escape key closes panel', async () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		);
		await fireEvent.click(researchButton!);

		// Press Escape key
		await fireEvent.keyDown(document, { key: 'Escape' });

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('active item has correct styling class', () => {
		const { container } = render(MegaNav, {
			props: {
				navigation: mockNavigation,
				currentPath: '/research'
			}
		});

		// Research should have active modifier class
		const researchButton = container.querySelector('button.nav-mega__item--active');
		expect(researchButton).toBeInTheDocument();
		expect(researchButton).toHaveTextContent('Research');
	});
});
