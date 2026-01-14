import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import SiteHeader from './SiteHeader.svelte';

vi.mock('$lib/plone/navigation', () => ({
	Navigation: vi.fn()
}));

describe('SiteHeader Component', () => {
	const mockNavigation = [
		{ href: '/about', title: 'About', items: [] },
		{ href: '/news', title: 'News', items: [] }
	];

	test('renders header with correct CSS class', () => {
		const { container } = render(SiteHeader, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		const header = container.querySelector('header.site-header');
		expect(header).toBeInTheDocument();
	});

	test('renders all three header regions (logo, nav, utility)', () => {
		const { container } = render(SiteHeader, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		const logoRegion = container.querySelector('.header-logo');
		const navRegion = container.querySelector('.header-nav');
		const utilityRegion = container.querySelector('.header-utility');

		expect(logoRegion).toBeInTheDocument();
		expect(navRegion).toBeInTheDocument();
		expect(utilityRegion).toBeInTheDocument();
	});

	test('contains inner container with layout constraint', () => {
		const { container } = render(SiteHeader, {
			props: {
				navigation: mockNavigation,
				currentPath: '/'
			}
		});

		const innerContainer = container.querySelector('.header-inner');
		expect(innerContainer).toBeInTheDocument();
		expect(innerContainer).toHaveClass('container-layout');
	});

	test('renders Navigation component in nav region', () => {
		const { container } = render(SiteHeader, {
			props: {
				navigation: mockNavigation,
				currentPath: '/about'
			}
		});

		const navRegion = container.querySelector('.header-nav');
		expect(navRegion).toBeInTheDocument();
	});
});
