import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import Navigation from './Navigation.svelte';
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
			}
		]
	},
	{
		href: '/about',
		title: 'About',
		items: [{ href: '/about/team', title: 'Team' }]
	},
	{
		href: '/contact',
		title: 'Contact'
	}
];

describe('Navigation Integration', () => {
	test('navigation renders with both desktop and mobile components', () => {
		const { container } = render(Navigation, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		const desktopNav = container.querySelector('.nav-mega');
		expect(desktopNav).toBeInTheDocument();

		const mobileNav = container.querySelector('.nav-mobile');
		expect(mobileNav).toBeInTheDocument();
	});

	test('navigation receives and renders data correctly', () => {
		const { container } = render(Navigation, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		const researchDesktop = container.querySelector('button[aria-controls="nav-mega-panel-research"]');
		expect(researchDesktop).toBeInTheDocument();
		expect(researchDesktop).toHaveTextContent('Research');

		const contactDesktop = container.querySelector('a.nav-mega__item[href="/contact"]');
		expect(contactDesktop).toBeInTheDocument();
		expect(contactDesktop).toHaveTextContent('Contact');
	});

	test('current path highlighting works for active items', () => {
		const { container } = render(Navigation, {
			props: {
				navigation: mockNavigation,
				currentPath: '/research/projects'
			}
		});

		const activeDesktopItem = container.querySelector('.nav-mega__item--active');
		expect(activeDesktopItem).toBeInTheDocument();
		expect(activeDesktopItem).toHaveTextContent('Research');
	});
});
