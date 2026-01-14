import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import Layout from './+layout.svelte';

vi.mock('$app/stores', () => ({
	page: {
		subscribe: (fn: (value: { params: { path: string } }) => void) => {
			fn({ params: { path: '' } });
			return () => {};
		}
	}
}));

vi.mock('$lib/plone/navigation', () => ({
	Navigation: vi.fn()
}));

vi.mock('@plone/registry', () => ({
	default: {
		blocks: {
			blocksConfig: {}
		}
	}
}));

describe('Layout Integration', () => {
	const mockData = {
		navigation: {
			items: [
				{ href: '/about', title: 'About', items: [] },
				{ href: '/news', title: 'News', items: [] }
			]
		},
		breadcrumbs: [
			{ href: '/about', title: 'About' },
			{ href: '/about/team', title: 'Team' }
		]
	};

	test('renders page with header, main, and footer structure', () => {
		const { container } = render(Layout, {
			props: { data: mockData }
		});

		const header = container.querySelector('header.site-header');
		const main = container.querySelector('main.main-content');
		const footer = container.querySelector('footer.site-footer');

		expect(header).toBeInTheDocument();
		expect(main).toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});

	test('breadcrumbs appear below header with wrapper', () => {
		const { container } = render(Layout, {
			props: { data: mockData }
		});

		const breadcrumbsWrapper = container.querySelector('.breadcrumbs-wrapper');
		expect(breadcrumbsWrapper).toBeInTheDocument();

		const breadcrumbs = container.querySelector('.breadcrumbs');
		expect(breadcrumbs).toBeInTheDocument();
	});

	test('main content has container-default applied', () => {
		const { container } = render(Layout, {
			props: { data: mockData }
		});

		const main = container.querySelector('main.main-content');
		expect(main).toHaveClass('container-default');
	});

	test('site wrapper contains all layout elements', () => {
		const { container } = render(Layout, {
			props: { data: mockData }
		});

		const siteWrapper = container.querySelector('.site-wrapper');
		expect(siteWrapper).toBeInTheDocument();

		const header = siteWrapper?.querySelector('header.site-header');
		const main = siteWrapper?.querySelector('main.main-content');
		const footer = siteWrapper?.querySelector('footer.site-footer');

		expect(header).toBeInTheDocument();
		expect(main).toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});

	test('breadcrumbs wrapper contains nav with container-default width', () => {
		const { container } = render(Layout, {
			props: { data: mockData }
		});

		const breadcrumbsWrapper = container.querySelector('.breadcrumbs-wrapper');
		const nav = breadcrumbsWrapper?.querySelector('nav.container-default');

		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
	});

	test('breadcrumbs are hidden when no breadcrumb data provided', () => {
		const { container } = render(Layout, {
			props: {
				data: {
					...mockData,
					breadcrumbs: []
				}
			}
		});

		const breadcrumbsWrapper = container.querySelector('.breadcrumbs-wrapper');
		expect(breadcrumbsWrapper).not.toBeInTheDocument();
	});
});
