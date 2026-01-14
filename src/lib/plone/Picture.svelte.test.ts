import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { readFileSync } from 'fs';
import { join } from 'path';
import Picture from './Picture.svelte';

/**
 * Task 4.1: Picture.svelte Deprecation Tests
 *
 * These tests verify:
 * 1. Picture.svelte has a deprecation notice
 * 2. Picture.svelte does not use /renderimg route
 */
describe('Picture.svelte - Deprecation', () => {
	test('Picture.svelte has deprecation notice at top of file', () => {
		// Read the file content to check for deprecation notice
		const filePath = join(process.cwd(), 'src/lib/plone/Picture.svelte');
		const fileContent = readFileSync(filePath, 'utf-8');

		// Check for deprecation notice
		expect(fileContent).toMatch(/@deprecated/i);
		expect(fileContent).toContain('ResponsiveImage');
	});

	test('Picture.svelte does not use /renderimg route in image URLs', () => {
		const mockCatalogItem = {
			href: '/my-content',
			image_scales: {
				image: [
					{
						scales: {
							preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 },
							mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 }
						}
					}
				]
			}
		};

		const { container } = render(Picture, {
			props: { catalogItem: mockCatalogItem }
		});

		// Check that srcset does not contain /renderimg
		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).not.toContain('/renderimg');

		// Check that img src does not contain /renderimg
		const img = container.querySelector('picture img');
		const src = img?.getAttribute('src') || '';
		expect(src).not.toContain('/renderimg');
	});
});
