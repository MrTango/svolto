import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
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
				items: [{ href: '/research/projects/ai', title: 'AI Research' }]
			},
			{ href: '/research/publications', title: 'Publications' }
		]
	},
	{
		href: '/about',
		title: 'About Us'
	},
	{
		href: '/contact',
		title: 'Contact',
		items: [
			{ href: '/contact/email', title: 'Email' },
			{ href: '/contact/phone', title: 'Phone' }
		]
	}
];

describe('Mobile Navigation', () => {
	test('hamburger icon toggles overlay visibility', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const trigger = getByRole('button', { name: /toggle navigation/i });
		expect(trigger).toBeInTheDocument();

		const overlay = container.querySelector('.nav-mobile__overlay');
		expect(overlay).not.toBeInTheDocument();

		await fireEvent.click(trigger);

		const overlayAfterOpen = container.querySelector('.nav-mobile__overlay');
		expect(overlayAfterOpen).toBeInTheDocument();

		await fireEvent.click(trigger);

		const overlayAfterClose = container.querySelector('.nav-mobile__overlay');
		expect(overlayAfterClose).not.toBeInTheDocument();
	});

	test('trigger icon transforms to X when menu is open', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		const trigger = getByRole('button', { name: /toggle navigation/i });

		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(trigger).toHaveClass('nav-mobile__trigger');
		expect(container.querySelector('.nav-mobile__trigger--open')).not.toBeInTheDocument();

		await fireEvent.click(trigger);

		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(trigger).toHaveClass('nav-mobile__trigger--open');
	});

	test('accordion expands and collapses for items with children', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		await fireEvent.click(getByRole('button', { name: /toggle navigation/i }));

		const researchButton = container.querySelector('[data-nav-item="/research"]');
		expect(researchButton).toBeInTheDocument();

		const chevron = researchButton?.querySelector('.nav-mobile__chevron');
		expect(chevron).toBeInTheDocument();
		expect(chevron).not.toHaveClass('nav-mobile__chevron--expanded');

		let nestedList = container.querySelector('.nav-mobile__list--level-2');
		expect(nestedList).not.toBeInTheDocument();

		await fireEvent.click(researchButton!);

		nestedList = container.querySelector('.nav-mobile__list--level-2');
		expect(nestedList).toBeInTheDocument();

		const expandedChevron = researchButton?.querySelector('.nav-mobile__chevron');
		expect(expandedChevron).toHaveClass('nav-mobile__chevron--expanded');

		await fireEvent.click(researchButton!);

		nestedList = container.querySelector('.nav-mobile__list--level-2');
		expect(nestedList).not.toBeInTheDocument();
	});

	test('items without children navigate directly without accordion', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/' }
		});

		await fireEvent.click(getByRole('button', { name: /toggle navigation/i }));

		const aboutLink = container.querySelector('a[href="/about"]');
		expect(aboutLink).toBeInTheDocument();

		const aboutChevron = aboutLink
			?.closest('.nav-mobile__item')
			?.querySelector('.nav-mobile__chevron');
		expect(aboutChevron).not.toBeInTheDocument();
	});

	test('home link is displayed at top with separator', async () => {
		const { container, getByRole } = render(MobileNav, {
			props: { navigation: mockNavigation, currentPath: '/about' }
		});

		await fireEvent.click(getByRole('button', { name: /toggle navigation/i }));

		const homeLink = container.querySelector('.nav-mobile__home');
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute('href', '/');
		expect(homeLink?.textContent).toContain('Startseite');

		const homeSeparator = container.querySelector('.nav-mobile__home-separator');
		expect(homeSeparator).toBeInTheDocument();
	});
});
