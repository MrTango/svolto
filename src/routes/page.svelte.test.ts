import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should render h1', () => {
		const mockData = {
			title: 'Test Title',
			'@id': 'http://localhost:8080/Plone',
			blocks: {},
			blocks_layout: { items: [] },
			listingData: {},
			listingPages: {},
			paginatedBlockCount: 0
		};

		render(Page, {
			props: {
				data: mockData
			}
		});
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});
});
