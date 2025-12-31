import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import Pagination from './Pagination.svelte';

describe('Pagination Component - Block-Specific Pagination', () => {
	test('renders pagination with blockId prop and uses simple page key when paginatedBlockCount <= 1', () => {
		const { container } = render(Pagination, {
			props: {
				currentPage: 2,
				totalPages: 5,
				baseUrl: 'http://localhost/news/',
				blockId: 'block-123',
				paginatedBlockCount: 1
			}
		});

		// Should render pagination nav
		const nav = container.querySelector('nav.pagination');
		expect(nav).toBeInTheDocument();

		// Check that page links use simple 'page' parameter (not block-specific)
		const pageLinks = container.querySelectorAll('a.pagination-link');
		const page3Link = Array.from(pageLinks).find((link) => link.textContent === '3');
		expect(page3Link).toBeInTheDocument();
		expect(page3Link?.getAttribute('href')).toBe('/news/?page=3');
	});

	test('uses block-specific page key when paginatedBlockCount > 1', () => {
		const { container } = render(Pagination, {
			props: {
				currentPage: 2,
				totalPages: 5,
				baseUrl: 'http://localhost/news/',
				blockId: 'block-123',
				paginatedBlockCount: 2
			}
		});

		// Check that page links use block-specific 'page-{slugifiedBlockId}' parameter
		const pageLinks = container.querySelectorAll('a.pagination-link');
		const page3Link = Array.from(pageLinks).find((link) => link.textContent === '3');
		expect(page3Link).toBeInTheDocument();
		// blockId 'block-123' should be slugified to 'block_123'
		expect(page3Link?.getAttribute('href')).toBe('/news/?page-block_123=3');
	});

	test('preserves existing query parameters when building pagination URLs', () => {
		const { container } = render(Pagination, {
			props: {
				currentPage: 2,
				totalPages: 5,
				baseUrl: 'http://localhost/news/?filter=active',
				blockId: 'block-123',
				paginatedBlockCount: 1
			}
		});

		// Check that existing query params are preserved
		const pageLinks = container.querySelectorAll('a.pagination-link');
		const page3Link = Array.from(pageLinks).find((link) => link.textContent === '3');
		expect(page3Link).toBeInTheDocument();
		const href = page3Link?.getAttribute('href');
		expect(href).toContain('filter=active');
		expect(href).toContain('page=3');
	});
});
