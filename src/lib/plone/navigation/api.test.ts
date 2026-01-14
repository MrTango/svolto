import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchNavigation, transformNavItem, transformNavigation, DEFAULT_NAV_DEPTH } from './api';
import type { PloneNavItem } from './types';

vi.mock('$env/static/public', () => ({
	PUBLIC_API_PATH: 'http://localhost:8080/Plone'
}));

describe('Navigation API', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	describe('fetchNavigation', () => {
		test('fetches navigation with depth parameter', async () => {
			const mockResponse = {
				'@id': 'http://localhost:8080/Plone/@navigation',
				items: [
					{
						'@id': 'http://localhost:8080/Plone/news',
						title: 'News'
					}
				]
			};

			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			await fetchNavigation(3, 'http://localhost:8080/Plone');

			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:8080/Plone/@navigation?expand.navigation.depth=3',
				expect.objectContaining({
					method: 'GET',
					headers: { Accept: 'application/json' }
				})
			);
		});

		test('transforms navigation data structure correctly', async () => {
			const mockResponse = {
				'@id': 'http://localhost:8080/Plone/@navigation',
				items: [
					{
						'@id': 'http://localhost:8080/Plone/research',
						title: 'Research',
						items: [
							{
								'@id': 'http://localhost:8080/Plone/research/projects',
								title: 'Projects',
								items: [
									{
										'@id': 'http://localhost:8080/Plone/research/projects/ai',
										title: 'AI Research'
									}
								]
							}
						]
					}
				]
			};

			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			const result = await fetchNavigation(3, 'http://localhost:8080/Plone');

			expect(result.items).toHaveLength(1);
			expect(result.items[0]).toEqual({
				href: '/research',
				title: 'Research',
				items: [
					{
						href: '/research/projects',
						title: 'Projects',
						items: [
							{
								href: '/research/projects/ai',
								title: 'AI Research',
								items: undefined
							}
						]
					}
				]
			});
		});

		test('returns empty items when API fails', async () => {
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			} as Response);

			const result = await fetchNavigation(3, 'http://localhost:8080/Plone');

			expect(result.items).toEqual([]);
		});

		test('returns empty items when fetch throws', async () => {
			vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

			const result = await fetchNavigation(3, 'http://localhost:8080/Plone');

			expect(result.items).toEqual([]);
		});

		test('fetches from language-specific endpoint with path parameter', async () => {
			const mockResponse = {
				items: [
					{ '@id': 'http://localhost:8080/Plone/de/news', title: 'Nachrichten' },
					{ '@id': 'http://localhost:8080/Plone/de/about', title: 'Über uns' }
				]
			};
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			await fetchNavigation(DEFAULT_NAV_DEPTH, 'http://localhost:8080/Plone', '/de');

			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:8080/Plone/de/@navigation?expand.navigation.depth=3',
				expect.objectContaining({
					method: 'GET',
					headers: { Accept: 'application/json' }
				})
			);
		});

		test('fetches from root when path is "/" (root path)', async () => {
			const mockResponse = { items: [] };
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			await fetchNavigation(DEFAULT_NAV_DEPTH, 'http://localhost:8080/Plone', '/');

			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:8080/Plone/@navigation?expand.navigation.depth=3',
				expect.any(Object)
			);
		});

		test('fetches from root when path is undefined', async () => {
			const mockResponse = { items: [] };
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			await fetchNavigation(DEFAULT_NAV_DEPTH, 'http://localhost:8080/Plone', undefined);

			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:8080/Plone/@navigation?expand.navigation.depth=3',
				expect.any(Object)
			);
		});

		test('respects custom depth with path parameter', async () => {
			const mockResponse = { items: [] };
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			await fetchNavigation(5, 'http://localhost:8080/Plone', '/en');

			expect(globalThis.fetch).toHaveBeenCalledWith(
				'http://localhost:8080/Plone/en/@navigation?expand.navigation.depth=5',
				expect.any(Object)
			);
		});

		test('transforms language-specific response items correctly', async () => {
			const mockResponse = {
				items: [
					{
						'@id': 'http://localhost:8080/Plone/de/news',
						title: 'Nachrichten',
						items: [{ '@id': 'http://localhost:8080/Plone/de/news/article1', title: 'Artikel 1' }]
					}
				]
			};
			vi.mocked(globalThis.fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			} as Response);

			const result = await fetchNavigation(DEFAULT_NAV_DEPTH, 'http://localhost:8080/Plone', '/de');

			expect(result.items[0].href).toBe('/de/news');
			expect(result.items[0].title).toBe('Nachrichten');
			expect(result.items[0].items?.[0].href).toBe('/de/news/article1');
		});
	});

	describe('transformNavItem', () => {
		test('converts @id to relative href', () => {
			const ploneItem: PloneNavItem = {
				'@id': 'http://localhost:8080/Plone/about',
				title: 'About Us'
			};

			const result = transformNavItem(ploneItem, 'http://localhost:8080/Plone');

			expect(result.href).toBe('/about');
			expect(result.title).toBe('About Us');
		});

		test('transforms nested items recursively', () => {
			const ploneItem: PloneNavItem = {
				'@id': 'http://localhost:8080/Plone/products',
				title: 'Products',
				items: [
					{
						'@id': 'http://localhost:8080/Plone/products/software',
						title: 'Software'
					}
				]
			};

			const result = transformNavItem(ploneItem, 'http://localhost:8080/Plone');

			expect(result.items).toHaveLength(1);
			expect(result.items![0].href).toBe('/products/software');
		});
	});
});
