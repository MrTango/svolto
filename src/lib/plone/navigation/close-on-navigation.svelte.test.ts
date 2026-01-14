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

describe('Close Menu on Navigation - Desktop', () => {
	test('clicking Level 1 headline link closes desktop panel', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Verify panel is open
		expect(researchButton).toHaveAttribute('aria-expanded', 'true');
		let panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Click the Level 1 headline link
		const headlineLink = panel?.querySelector('.nav-mega__panel-title-link') as HTMLElement;
		expect(headlineLink).toBeInTheDocument();
		await fireEvent.click(headlineLink);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('clicking Level 2 header link closes desktop panel', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Verify panel is open
		let panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Click a Level 2 header link (Projects)
		const level2Link = panel?.querySelector('.nav-mega__l2-header[href="/research/projects"]') as HTMLElement;
		expect(level2Link).toBeInTheDocument();
		await fireEvent.click(level2Link);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('clicking Level 3 item link closes desktop panel', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Verify panel is open
		let panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Click a Level 3 item link (AI Research)
		const level3Link = panel?.querySelector('.nav-mega__l3-item[href="/research/projects/ai"]') as HTMLElement;
		expect(level3Link).toBeInTheDocument();
		await fireEvent.click(level3Link);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});

	test('close button still works after implementing close-on-navigation', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		// Verify panel is open
		let panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).toBeInTheDocument();

		// Click the close button
		const closeBtn = panel?.querySelector('.nav-mega__close-btn') as HTMLElement;
		expect(closeBtn).toBeInTheDocument();
		await fireEvent.click(closeBtn);

		// Panel should be closed
		expect(researchButton).toHaveAttribute('aria-expanded', 'false');
		panel = container.querySelector('#nav-mega-panel-research');
		expect(panel).not.toBeInTheDocument();
	});
});

describe('Close Menu on Navigation - Mobile', () => {
	test('clicking home link closes mobile overlay', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Verify overlay is open
		let overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).toBeInTheDocument();

		// Click the home link
		const homeLink = container.querySelector('.nav-mobile__home') as HTMLElement;
		expect(homeLink).toBeInTheDocument();
		await fireEvent.click(homeLink);

		// Overlay should be closed
		overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();
	});

	test('clicking parent link (from Task 8.4) closes mobile overlay', async () => {
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

		// Wait for parent link to appear
		await waitFor(() => {
			const parentLink = container.querySelector(
				'a[data-nav-parent-link="/research"]'
			) as HTMLAnchorElement;
			expect(parentLink).toBeInTheDocument();
		});

		// Click the parent link
		const parentLink = container.querySelector(
			'a[data-nav-parent-link="/research"]'
		) as HTMLElement;
		await fireEvent.click(parentLink);

		// Overlay should be closed
		const overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();
	});

	test('clicking navigation item link (leaf node) closes mobile overlay', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Verify overlay is open
		let overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).toBeInTheDocument();

		// Click the Contact link (item without children)
		const contactLink = container.querySelector(
			'a[data-nav-item="/contact"]'
		) as HTMLElement;
		expect(contactLink).toBeInTheDocument();
		await fireEvent.click(contactLink);

		// Overlay should be closed
		overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();
	});

	test('clicking nested leaf item closes mobile overlay', async () => {
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

		// Wait for Projects to appear, then expand it
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

		// Wait for Level 3 items to appear
		await waitFor(() => {
			const aiLink = container.querySelector(
				'a[data-nav-item="/research/projects/ai"]'
			) as HTMLElement;
			expect(aiLink).toBeInTheDocument();
		});

		// Click Level 3 item
		const aiLink = container.querySelector(
			'a[data-nav-item="/research/projects/ai"]'
		) as HTMLElement;
		await fireEvent.click(aiLink);

		// Overlay should be closed
		const overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();
	});

	test('hamburger trigger still works after closing via navigation', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		// Verify overlay is open
		let overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).toBeInTheDocument();

		// Click the home link to close
		const homeLink = container.querySelector('.nav-mobile__home') as HTMLElement;
		await fireEvent.click(homeLink);

		// Verify closed
		overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();

		// Open again with trigger
		await fireEvent.click(trigger);

		// Should be open again
		overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).toBeInTheDocument();
	});
});

describe('Navigation Works Correctly After Menu Closes', () => {
	test('Level 1 headline link href is preserved after adding close handler', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		const headlineLink = container.querySelector('.nav-mega__panel-title-link') as HTMLAnchorElement;
		expect(headlineLink).toHaveAttribute('href', '/research');
	});

	test('Level 2 header link href is preserved after adding close handler', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		const level2Link = container.querySelector('.nav-mega__l2-header[href="/research/projects"]') as HTMLAnchorElement;
		expect(level2Link).toHaveAttribute('href', '/research/projects');
	});

	test('Level 3 item link href is preserved after adding close handler', async () => {
		const { container } = render(MegaNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open Research panel
		const researchButton = container.querySelector(
			'button.nav-mega__item[aria-controls="nav-mega-panel-research"]'
		) as HTMLElement;
		await fireEvent.click(researchButton);

		const level3Link = container.querySelector('.nav-mega__l3-item[href="/research/projects/ai"]') as HTMLAnchorElement;
		expect(level3Link).toHaveAttribute('href', '/research/projects/ai');
	});

	test('mobile home link href is preserved', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		const homeLink = container.querySelector('.nav-mobile__home') as HTMLAnchorElement;
		expect(homeLink).toHaveAttribute('href', '/');
	});

	test('mobile leaf item link href is preserved', async () => {
		const { container } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		// Open mobile menu
		const trigger = container.querySelector('.nav-mobile__trigger') as HTMLElement;
		await fireEvent.click(trigger);

		const contactLink = container.querySelector('a[data-nav-item="/contact"]') as HTMLAnchorElement;
		expect(contactLink).toHaveAttribute('href', '/contact');
	});

	test('mobile parent link href is preserved', async () => {
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

		await waitFor(() => {
			const parentLink = container.querySelector(
				'a[data-nav-parent-link="/research"]'
			) as HTMLAnchorElement;
			expect(parentLink).toHaveAttribute('href', '/research');
		});
	});
});
