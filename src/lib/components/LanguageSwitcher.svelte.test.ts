import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import LanguageSwitcher from './LanguageSwitcher.svelte';
import * as languageCookie from '$lib/utils/language-cookie';

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('LanguageSwitcher Component', () => {
	test('renders language links with native names', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en'
			}
		});

		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Deutsch')).toBeInTheDocument();
		expect(screen.getByText('Français')).toBeInTheDocument();
	});

	test('current language is highlighted/bolded with aria-current="true"', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'de'
			}
		});

		const currentLangLink = screen.getByText('Deutsch').closest('a');
		expect(currentLangLink).toHaveAttribute('aria-current', 'true');
		expect(currentLangLink).toHaveClass('lang-link--current');
	});

	test('pipe separators appear between language links', () => {
		const { container } = render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en'
			}
		});

		const links = container.querySelectorAll('a');
		expect(links.length).toBe(3);

		// First two links should have separator class, last should not
		expect(links[0]).toHaveClass('lang-link--separator');
		expect(links[1]).toHaveClass('lang-link--separator');
		expect(links[2]).not.toHaveClass('lang-link--separator');
	});

	test('does not render when availableLanguages is empty', () => {
		const { container } = render(LanguageSwitcher, {
			props: {
				availableLanguages: [],
				currentLang: 'en'
			}
		});

		const nav = container.querySelector('nav');
		expect(nav).not.toBeInTheDocument();
	});

	test('language link navigates to translation URL when available', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				translations: [
					{ language: 'de', '@id': 'http://localhost:8080/Plone/de/meine-seite' },
					{ language: 'fr', '@id': 'http://localhost:8080/Plone/fr/ma-page' }
				]
			}
		});

		const deutschLink = screen.getByText('Deutsch').closest('a');
		const francaisLink = screen.getByText('Français').closest('a');

		expect(deutschLink).toHaveAttribute('href', '/de/meine-seite');
		expect(francaisLink).toHaveAttribute('href', '/fr/ma-page');
	});

	test('falls back to language root URL when no translation exists', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				translations: [] // No translations available
			}
		});

		const deutschLink = screen.getByText('Deutsch').closest('a');
		const francaisLink = screen.getByText('Français').closest('a');

		// Should fall back to language root URLs
		expect(deutschLink).toHaveAttribute('href', '/de');
		expect(francaisLink).toHaveAttribute('href', '/fr');
	});

	test('calls onSwitch callback when language link is clicked', async () => {
		const onSwitch = vi.fn();

		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				onSwitch
			}
		});

		const deutschLink = screen.getByText('Deutsch');
		await fireEvent.click(deutschLink);

		expect(onSwitch).toHaveBeenCalledWith('de');
	});

	test('displays language code as fallback when language is not in langmap', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'xyz'],
				currentLang: 'en'
			}
		});

		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('xyz')).toBeInTheDocument();
	});
});

describe('LanguageSwitcher Cookie Behavior', () => {
	let setLanguageCookieClientSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		setLanguageCookieClientSpy = vi
			.spyOn(languageCookie, 'setLanguageCookieClient')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		setLanguageCookieClientSpy.mockRestore();
	});

	test('clicking language link calls setLanguageCookieClient immediately', async () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en'
			}
		});

		const deutschLink = screen.getByText('Deutsch');
		await fireEvent.click(deutschLink);

		expect(setLanguageCookieClientSpy).toHaveBeenCalledWith('de');
		expect(setLanguageCookieClientSpy).toHaveBeenCalledTimes(1);
	});

	test('cookie is set before onSwitch callback is invoked', async () => {
		const callOrder: string[] = [];

		setLanguageCookieClientSpy.mockImplementation(() => {
			callOrder.push('cookie');
		});

		const onSwitch = vi.fn(() => {
			callOrder.push('callback');
		});

		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				onSwitch
			}
		});

		const deutschLink = screen.getByText('Deutsch');
		await fireEvent.click(deutschLink);

		expect(callOrder).toEqual(['cookie', 'callback']);
	});

	test('onSwitch callback is still invoked after cookie is set', async () => {
		const onSwitch = vi.fn();

		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en',
				onSwitch
			}
		});

		const deutschLink = screen.getByText('Deutsch');
		await fireEvent.click(deutschLink);

		expect(setLanguageCookieClientSpy).toHaveBeenCalledWith('de');
		expect(onSwitch).toHaveBeenCalledWith('de');
	});
});

describe('LanguageSwitcher Accessibility', () => {
	test('language links have correct aria-label attributes', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en'
			}
		});

		const englishLink = screen.getByText('English').closest('a');
		const deutschLink = screen.getByText('Deutsch').closest('a');
		const francaisLink = screen.getByText('Français').closest('a');

		expect(englishLink).toHaveAttribute('aria-label', 'Current language: English');
		expect(deutschLink).toHaveAttribute('aria-label', 'Switch to Deutsch');
		expect(francaisLink).toHaveAttribute('aria-label', 'Switch to Français');
	});

	test('current language link has aria-current="true" attribute', () => {
		render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'fr'
			}
		});

		const englishLink = screen.getByText('English').closest('a');
		const deutschLink = screen.getByText('Deutsch').closest('a');
		const francaisLink = screen.getByText('Français').closest('a');

		expect(englishLink).not.toHaveAttribute('aria-current');
		expect(deutschLink).not.toHaveAttribute('aria-current');
		expect(francaisLink).toHaveAttribute('aria-current', 'true');
	});

	test('language links have visible focus states for keyboard navigation', () => {
		const { container } = render(LanguageSwitcher, {
			props: {
				availableLanguages: ['en', 'de', 'fr'],
				currentLang: 'en'
			}
		});

		const links = container.querySelectorAll('a');

		// All links should have the lang-link class which includes focus-visible styles
		links.forEach((link) => {
			expect(link).toHaveClass('lang-link');
		});

		const nav = container.querySelector('nav');
		expect(nav).toHaveAttribute('aria-label', 'Language selection');
	});
});
