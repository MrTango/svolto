import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import MegaNav from './MegaNav.svelte';
import MobileNav from './MobileNav.svelte';
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
	}
];

describe('Two-Click Navigation Pattern - Desktop', () => {
	test('click on Level 1 item opens panel (does not navigate)', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		expect(researchButton).toBeInTheDocument();

		// Should be a button (not a link), so clicking opens panel
		expect(researchButton.tagName).toBe('BUTTON');

		// Click to open panel
		await fireEvent.click(researchButton);

		// Panel should open
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();
	});

	test('headline link in panel is clickable and navigates to Level 1 URL', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Find the headline link in the panel
		const panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		const headlineLink = panel?.querySelector('.nav-mega__panel-title-link') as HTMLAnchorElement;
		expect(headlineLink).toBeInTheDocument();
		expect(headlineLink.tagName).toBe('A');
		expect(headlineLink).toHaveAttribute('href', '/research');
		expect(headlineLink).toHaveTextContent('Research');
	});

	test('headline link maintains heading semantic structure', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// The link should be inside an h2 element
		const panel = container.querySelector('#nav-mega-panel-research');
		const h2 = panel?.querySelector('h2.nav-mega__panel-title');
		expect(h2).toBeInTheDocument();

		const linkInsideH2 = h2?.querySelector('a.nav-mega__panel-title-link');
		expect(linkInsideH2).toBeInTheDocument();
		expect(linkInsideH2).toHaveAttribute('href', '/research');
	});

	test('focus moves to headline link when panel opens', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Wait for focus to move to headline link
		await waitFor(() => {
			const headlineLink = container.querySelector(
				'#nav-mega-panel-research-headline-link'
			) as HTMLElement;
			expect(document.activeElement).toBe(headlineLink);
		});
	});

	test('headline link has appropriate focus styling', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		const headlineLink = container.querySelector('.nav-mega__panel-title-link') as HTMLElement;
		expect(headlineLink).toBeInTheDocument();

		// Focus the link to check it can receive focus
		headlineLink.focus();
		expect(document.activeElement).toBe(headlineLink);
	});
});

describe('Two-Click Navigation Pattern - Mobile', () => {
	test('when Level 1 item is expanded, parent link appears at top of children', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Find and expand Research item
		const researchButton = container.querySelector(
			'button[data-nav-item="/research"]'
		) as HTMLElement;
		expect(researchButton).toBeInTheDocument();
		await fireEvent.click(researchButton);

		// After expansion, the nested list should show a parent link to "/research"
		await waitFor(() => {
			const parentLink = container.querySelector(
				'a[data-nav-parent-link="/research"]'
			) as HTMLAnchorElement;
			expect(parentLink).toBeInTheDocument();
			expect(parentLink).toHaveAttribute('href', '/research');
			expect(parentLink).toHaveTextContent('Research');
		});
	});

	test('parent link in expanded accordion is styled distinctly', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Expand Research item
		const researchButton = container.querySelector(
			'button[data-nav-item="/research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		await waitFor(() => {
			const parentLink = container.querySelector(
				'.nav-mobile__parent-link'
			) as HTMLAnchorElement;
			expect(parentLink).toBeInTheDocument();
			expect(parentLink).toHaveClass('nav-mobile__parent-link');
		});
	});

	test('accordion expand/collapse works with chevron tap', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Find Research item button
		const researchButton = container.querySelector(
			'button[data-nav-item="/research"]'
		) as HTMLElement;
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');

		// Click to expand
		await fireEvent.click(researchButton);
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');

		// Click again to collapse
		await fireEvent.click(researchButton);
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
	});

	test('nested expansion shows parent link for nested Level 2 item', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Expand Research
		const researchButton = container.querySelector(
			'button[data-nav-item="/research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Wait for expansion, then expand Projects
		await waitFor(() => {
			const projectsButton = container.querySelector(
				'button[data-nav-item="/research/projects"]'
			) as HTMLElement;
			expect(projectsButton).toBeInTheDocument();
		});

		const projectsButton = container.querySelector(
			'button[data-nav-item="/research/projects"]'
		) as HTMLElement;
		await fireEvent.click(projectsButton);

		// Should show parent link for Projects
		await waitFor(() => {
			const parentLink = container.querySelector(
				'a[data-nav-parent-link="/research/projects"]'
			) as HTMLAnchorElement;
			expect(parentLink).toBeInTheDocument();
			expect(parentLink).toHaveAttribute('href', '/research/projects');
			expect(parentLink).toHaveTextContent('Projects');
		});
	});
});
