import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import SiteFooter from './SiteFooter.svelte';

describe('SiteFooter Component', () => {
	test('renders footer with correct CSS classes', () => {
		const { container } = render(SiteFooter);

		const footer = container.querySelector('footer.site-footer');
		expect(footer).toBeInTheDocument();
	});

	test('renders footer-content region', () => {
		const { container } = render(SiteFooter);

		const footerContent = container.querySelector('.footer-content');
		expect(footerContent).toBeInTheDocument();
	});

	test('footer-content has container-layout class for width constraint', () => {
		const { container } = render(SiteFooter);

		const footerContent = container.querySelector('.footer-content');
		expect(footerContent).toHaveClass('container-layout');
	});
});
