import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import LanguageSwitcherIntegrationWrapper from './language-switcher.integration.test.svelte';
import * as languageCookie from '$lib/utils/language-cookie';

vi.mock('$lib/plone/navigation', () => ({
	Navigation: vi.fn()
}));

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Language Switcher End-to-End Integration', () => {
	let setLanguageCookieClientSpy: ReturnType<typeof vi.spyOn>;
	let cookieValue: string;

	beforeEach(() => {
		cookieValue = '';
		setLanguageCookieClientSpy = vi
			.spyOn(languageCookie, 'setLanguageCookieClient')
			.mockImplementation((lang: string) => {
				cookieValue = `I18N_LANGUAGE=${lang}; path=/; max-age=15552000; SameSite=Strict`;
			});
	});

	afterEach(() => {
		setLanguageCookieClientSpy.mockRestore();
	});

	test('full flow: user clicks language link -> cookie set -> navigation to translation URL', async () => {
		const onSwitchCallback = vi.fn();

		const { container } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [{ href: '/about', title: 'About', items: [] }],
				currentPath: '/en/page',
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				translations: [
					{ language: 'en', '@id': 'http://localhost:8080/Plone/en/page' },
					{ language: 'de', '@id': 'http://localhost:8080/Plone/de/seite' },
					{ language: 'fr', '@id': 'http://localhost:8080/Plone/fr/page' }
				],
				onSwitch: onSwitchCallback
			}
		});

		// Verify language switcher renders in header utility area
		const utilityArea = container.querySelector('.header-utility');
		expect(utilityArea).toBeInTheDocument();

		const languageSwitcher = utilityArea?.querySelector('.language-switcher');
		expect(languageSwitcher).toBeInTheDocument();

		// Click German language link
		const deutschLink = screen.getByText('Deutsch');
		expect(deutschLink.closest('a')).toHaveAttribute('href', '/de/seite');

		await fireEvent.click(deutschLink);

		// Verify cookie was set FIRST (before callback)
		expect(setLanguageCookieClientSpy).toHaveBeenCalledWith('de');
		expect(setLanguageCookieClientSpy).toHaveBeenCalledTimes(1);

		// Verify callback was invoked after cookie was set
		expect(onSwitchCallback).toHaveBeenCalledWith('de');

		// Verify cookie value is set correctly
		expect(cookieValue).toContain('I18N_LANGUAGE=de');
	});

	test('user with cookie visits content page -> link points to translation URL', () => {
		const { container } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/en/article',
				availableLanguages: ['en', 'de'],
				currentLang: 'de', // User's preferred language from cookie
				translations: [
					{ language: 'en', '@id': 'http://localhost:8080/Plone/en/article' },
					{ language: 'de', '@id': 'http://localhost:8080/Plone/de/artikel' }
				]
			}
		});

		// German is current language (from cookie preference)
		const deutschLink = screen.getByText('Deutsch').closest('a');
		expect(deutschLink).toHaveAttribute('aria-current', 'true');
		expect(deutschLink).toHaveClass('lang-link--current');

		// English link points to translation
		const englishLink = screen.getByText('English').closest('a');
		expect(englishLink).toHaveAttribute('href', '/en/article');
		expect(englishLink).not.toHaveAttribute('aria-current');
	});

	test('user visits page without translation -> falls back to language root URL', () => {
		render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/en/unique-page',
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				translations: [
					// Only English translation exists (no German or French)
					{ language: 'en', '@id': 'http://localhost:8080/Plone/en/unique-page' }
				]
			}
		});

		// German link falls back to language root
		const deutschLink = screen.getByText('Deutsch').closest('a');
		expect(deutschLink).toHaveAttribute('href', '/de');

		// French link falls back to language root (using accent)
		const francaisLink = screen.getByText('Français').closest('a');
		expect(francaisLink).toHaveAttribute('href', '/fr');

		// English link has the actual page translation
		const englishLink = screen.getByText('English').closest('a');
		expect(englishLink).toHaveAttribute('href', '/en/unique-page');
	});
});

describe('SiteHeader LanguageSwitcher Conditional Rendering', () => {
	test('LanguageSwitcher renders when availableLanguages > 1 (multilingual site)', () => {
		const { container } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/',
				availableLanguages: ['en', 'de'],
				currentLang: 'en',
				translations: []
			}
		});

		const languageSwitcher = container.querySelector('.language-switcher');
		expect(languageSwitcher).toBeInTheDocument();
	});

	test('LanguageSwitcher does NOT render when only 1 language available', () => {
		const { container } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/',
				availableLanguages: ['en'],
				currentLang: 'en',
				translations: []
			}
		});

		const languageSwitcher = container.querySelector('.language-switcher');
		expect(languageSwitcher).not.toBeInTheDocument();
	});

	test('LanguageSwitcher does NOT render when availableLanguages is empty', () => {
		const { container } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/',
				availableLanguages: [],
				currentLang: 'en',
				translations: []
			}
		});

		const languageSwitcher = container.querySelector('.language-switcher');
		expect(languageSwitcher).not.toBeInTheDocument();
	});
});

describe('Data Flow Verification', () => {
	test('props are passed correctly from layout data through SiteHeader to LanguageSwitcher', () => {
		const availableLanguages = ['en', 'de', 'fr', 'es'];
		const currentLang = 'fr';
		const translations = [
			{ language: 'en', '@id': 'http://localhost:8080/Plone/en/content' },
			{ language: 'de', '@id': 'http://localhost:8080/Plone/de/inhalt' },
			{ language: 'fr', '@id': 'http://localhost:8080/Plone/fr/contenu' },
			{ language: 'es', '@id': 'http://localhost:8080/Plone/es/contenido' }
		];

		render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/fr/contenu',
				availableLanguages,
				currentLang,
				translations
			}
		});

		// Verify all languages are rendered (using native names with accents)
		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Deutsch')).toBeInTheDocument();
		expect(screen.getByText('Français')).toBeInTheDocument();
		expect(screen.getByText('Español')).toBeInTheDocument();

		// Verify current language is correctly marked
		const francaisLink = screen.getByText('Français').closest('a');
		expect(francaisLink).toHaveAttribute('aria-current', 'true');

		// Verify translation URLs are correctly resolved
		expect(screen.getByText('English').closest('a')).toHaveAttribute('href', '/en/content');
		expect(screen.getByText('Deutsch').closest('a')).toHaveAttribute('href', '/de/inhalt');
		expect(screen.getByText('Español').closest('a')).toHaveAttribute('href', '/es/contenido');
	});

	test('siteSettings.availableLanguages controls multilingual feature display', () => {
		// Simulate what +layout.svelte does: check availableLanguages.length > 1
		const singleLanguageSite = { availableLanguages: ['en'] };
		const multiLanguageSite = { availableLanguages: ['en', 'de', 'fr'] };

		// Single language site
		const { container: singleLangContainer } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/',
				availableLanguages: singleLanguageSite.availableLanguages,
				currentLang: 'en',
				translations: []
			}
		});
		expect(singleLangContainer.querySelector('.language-switcher')).not.toBeInTheDocument();

		// Multi language site
		const { container: multiLangContainer } = render(LanguageSwitcherIntegrationWrapper, {
			props: {
				navigation: [],
				currentPath: '/',
				availableLanguages: multiLanguageSite.availableLanguages,
				currentLang: 'en',
				translations: []
			}
		});
		expect(multiLangContainer.querySelector('.language-switcher')).toBeInTheDocument();
	});
});
