import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import SiteHeaderWithLanguageSwitcher from './SiteHeader.integration.test.svelte';

vi.mock('$lib/plone/navigation', () => ({
	Navigation: vi.fn()
}));

describe('SiteHeader LanguageSwitcher Integration', () => {
	const mockNavigation = [
		{ href: '/about', title: 'About', items: [] },
		{ href: '/news', title: 'News', items: [] }
	];

	test('LanguageSwitcher renders in header utility area', () => {
		const { container } = render(SiteHeaderWithLanguageSwitcher, {
			props: {
				navigation: mockNavigation,
				currentPath: '/',
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				translations: []
			}
		});

		const utilityArea = container.querySelector('.header-utility');
		expect(utilityArea).toBeInTheDocument();

		const languageSwitcher = utilityArea?.querySelector('.language-switcher');
		expect(languageSwitcher).toBeInTheDocument();

		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Deutsch')).toBeInTheDocument();
		expect(screen.getByText('Français')).toBeInTheDocument();
	});

	test('LanguageSwitcher receives correct props from layout data', () => {
		render(SiteHeaderWithLanguageSwitcher, {
			props: {
				navigation: mockNavigation,
				currentPath: '/',
				availableLanguages: ['en', 'de'],
				currentLang: 'de',
				translations: [
					{ language: 'en', '@id': 'http://localhost:8080/Plone/en/my-page' }
				]
			}
		});

		const deutschLink = screen.getByText('Deutsch').closest('a');
		expect(deutschLink).toHaveAttribute('aria-current', 'true');
		expect(deutschLink).toHaveClass('lang-link--current');

		const englishLink = screen.getByText('English').closest('a');
		expect(englishLink).toHaveAttribute('href', '/en/my-page');
		expect(englishLink).not.toHaveAttribute('aria-current');
	});

	test('LanguageSwitcher does not render when multilingual is disabled', () => {
		const { container } = render(SiteHeaderWithLanguageSwitcher, {
			props: {
				navigation: mockNavigation,
				currentPath: '/',
				availableLanguages: ['en'],
				currentLang: 'en',
				translations: []
			}
		});

		const utilityArea = container.querySelector('.header-utility');
		expect(utilityArea).toBeInTheDocument();

		const languageSwitcher = utilityArea?.querySelector('.language-switcher');
		expect(languageSwitcher).not.toBeInTheDocument();
	});
});
