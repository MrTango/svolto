import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	fetchSiteSettings,
	parseAcceptLanguage,
	detectLanguageFromHeaders,
	extractTranslations,
	fetchContentTranslations,
	extractLanguageFromPath,
	extractRelativePathFromUrl
} from './site';

describe('fetchSiteSettings', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	test('fetches @site endpoint and returns language settings', async () => {
		const mockSiteResponse = {
			'plone.available_languages': ['en', 'de', 'fr'],
			'plone.default_language': 'en',
			'plone.use_cookie_negotiation': true,
			'plone.use_request_negotiation': true
		};

		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockSiteResponse)
		} as Response);

		const result = await fetchSiteSettings('http://localhost:8080/Plone');

		expect(globalThis.fetch).toHaveBeenCalledWith(
			'http://localhost:8080/Plone/@site',
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Accept: 'application/json'
				})
			})
		);

		expect(result).toEqual({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
	});

	test('returns default values when API request fails', async () => {
		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error'
		} as Response);

		const result = await fetchSiteSettings('http://localhost:8080/Plone');

		expect(result).toEqual({
			availableLanguages: ['en'],
			defaultLanguage: 'en',
			useCookieNegotiation: false,
			useRequestNegotiation: false
		});
	});

	test('returns default values when fetch throws network error', async () => {
		vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

		const result = await fetchSiteSettings('http://localhost:8080/Plone');

		expect(result).toEqual({
			availableLanguages: ['en'],
			defaultLanguage: 'en',
			useCookieNegotiation: false,
			useRequestNegotiation: false
		});
	});
});

describe('fetchContentTranslations', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
	});

	test('fetches translations for content path', async () => {
		const mockTranslationsResponse = {
			'@id': 'http://localhost:8080/Plone/en/page/@translations',
			items: [
				{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' },
				{ '@id': 'http://localhost:8080/Plone/de/seite', language: 'de' }
			]
		};

		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockTranslationsResponse)
		} as Response);

		const result = await fetchContentTranslations('/en/page', 'http://localhost:8080/Plone');

		expect(globalThis.fetch).toHaveBeenCalledWith(
			'http://localhost:8080/Plone/en/page/@translations',
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Accept: 'application/json'
				})
			})
		);

		expect(result).toEqual([
			{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' },
			{ '@id': 'http://localhost:8080/Plone/de/seite', language: 'de' }
		]);
	});

	test('returns empty array when API request fails', async () => {
		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: false,
			status: 404
		} as Response);

		const result = await fetchContentTranslations('/en/nonexistent', 'http://localhost:8080/Plone');

		expect(result).toEqual([]);
	});

	test('returns empty array when fetch throws error', async () => {
		vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'));

		const result = await fetchContentTranslations('/en/page', 'http://localhost:8080/Plone');

		expect(result).toEqual([]);
	});
});

describe('extractLanguageFromPath', () => {
	const availableLanguages = ['en', 'de', 'fr'];

	test('extracts language code from path with language prefix', () => {
		expect(extractLanguageFromPath('/en/page', availableLanguages)).toBe('en');
		expect(extractLanguageFromPath('/de/seite', availableLanguages)).toBe('de');
		expect(extractLanguageFromPath('/fr/page/subpage', availableLanguages)).toBe('fr');
	});

	test('returns undefined for root path', () => {
		expect(extractLanguageFromPath('/', availableLanguages)).toBeUndefined();
	});

	test('returns undefined for path without language prefix', () => {
		expect(extractLanguageFromPath('/about', availableLanguages)).toBeUndefined();
		expect(extractLanguageFromPath('/news/article', availableLanguages)).toBeUndefined();
	});

	test('returns undefined when first segment is not available language', () => {
		expect(extractLanguageFromPath('/es/page', availableLanguages)).toBeUndefined();
	});
});

describe('extractRelativePathFromUrl', () => {
	test('extracts relative path from Plone URL', () => {
		const result = extractRelativePathFromUrl(
			'http://localhost:8080/Plone/de/seite',
			'http://localhost:8080/Plone'
		);
		expect(result).toBe('/de/seite');
	});

	test('handles URL without trailing slash on API path', () => {
		const result = extractRelativePathFromUrl(
			'http://localhost:8080/Plone/en/page/subpage',
			'http://localhost:8080/Plone'
		);
		expect(result).toBe('/en/page/subpage');
	});

	test('handles API path with trailing slash', () => {
		const result = extractRelativePathFromUrl(
			'http://localhost:8080/Plone/fr/article',
			'http://localhost:8080/Plone/'
		);
		expect(result).toBe('/fr/article');
	});

	test('returns original string for non-matching URL', () => {
		const result = extractRelativePathFromUrl(
			'http://other-server.com/de/seite',
			'http://localhost:8080/Plone'
		);
		expect(result).toBe('/de/seite');
	});
});

describe('parseAcceptLanguage', () => {
	test('parses Accept-Language header and returns prioritized languages', () => {
		const header = 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7';
		const result = parseAcceptLanguage(header);

		expect(result).toEqual(['de-DE', 'de', 'en-US', 'en']);
	});

	test('handles simple language codes', () => {
		const header = 'en';
		const result = parseAcceptLanguage(header);

		expect(result).toEqual(['en']);
	});

	test('returns empty array for empty/undefined header', () => {
		expect(parseAcceptLanguage('')).toEqual([]);
		expect(parseAcceptLanguage(undefined)).toEqual([]);
	});
});

describe('detectLanguageFromHeaders', () => {
	test('prefers cookie language when available', () => {
		const cookieLang = 'de';
		const acceptLanguageHeader = 'en-US,en;q=0.9';
		const availableLanguages = ['en', 'de', 'fr'];
		const useRequestNegotiation = true;

		const result = detectLanguageFromHeaders(
			cookieLang,
			acceptLanguageHeader,
			availableLanguages,
			useRequestNegotiation,
			'en'
		);

		expect(result).toBe('de');
	});

	test('falls back to Accept-Language when no cookie and request negotiation enabled', () => {
		const cookieLang = undefined;
		const acceptLanguageHeader = 'de-DE,de;q=0.9,en;q=0.8';
		const availableLanguages = ['en', 'de', 'fr'];
		const useRequestNegotiation = true;

		const result = detectLanguageFromHeaders(
			cookieLang,
			acceptLanguageHeader,
			availableLanguages,
			useRequestNegotiation,
			'en'
		);

		expect(result).toBe('de');
	});

	test('uses default language when request negotiation is disabled', () => {
		const cookieLang = undefined;
		const acceptLanguageHeader = 'de-DE,de;q=0.9';
		const availableLanguages = ['en', 'de', 'fr'];
		const useRequestNegotiation = false;

		const result = detectLanguageFromHeaders(
			cookieLang,
			acceptLanguageHeader,
			availableLanguages,
			useRequestNegotiation,
			'en'
		);

		expect(result).toBe('en');
	});

	test('ignores invalid cookie language not in available languages', () => {
		const cookieLang = 'es'; // Spanish not in available languages
		const acceptLanguageHeader = 'de-DE,de;q=0.9';
		const availableLanguages = ['en', 'de', 'fr'];
		const useRequestNegotiation = true;

		const result = detectLanguageFromHeaders(
			cookieLang,
			acceptLanguageHeader,
			availableLanguages,
			useRequestNegotiation,
			'en'
		);

		// Should skip invalid cookie and use Accept-Language
		expect(result).toBe('de');
	});

	test('matches base language from Accept-Language when exact match not available', () => {
		const cookieLang = undefined;
		const acceptLanguageHeader = 'de-AT,de-DE;q=0.9'; // de-AT and de-DE variants
		const availableLanguages = ['en', 'de', 'fr']; // Only base 'de' available
		const useRequestNegotiation = true;

		const result = detectLanguageFromHeaders(
			cookieLang,
			acceptLanguageHeader,
			availableLanguages,
			useRequestNegotiation,
			'en'
		);

		// Should match base language 'de' from 'de-AT'
		expect(result).toBe('de');
	});
});

describe('extractTranslations', () => {
	test('extracts translations array from @components.translations.items', () => {
		const contentData = {
			'@id': 'http://localhost:8080/Plone/en/page',
			title: 'Test Page',
			'@components': {
				translations: {
					items: [
						{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' },
						{ '@id': 'http://localhost:8080/Plone/de/seite', language: 'de' },
						{ '@id': 'http://localhost:8080/Plone/fr/page', language: 'fr' }
					]
				}
			}
		};

		const translations = extractTranslations(contentData);

		expect(translations).toHaveLength(3);
		expect(translations).toEqual([
			{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' },
			{ '@id': 'http://localhost:8080/Plone/de/seite', language: 'de' },
			{ '@id': 'http://localhost:8080/Plone/fr/page', language: 'fr' }
		]);
	});

	test('returns empty array when translations not present', () => {
		const contentData = {
			'@id': 'http://localhost:8080/Plone/page',
			title: 'Test Page'
		};

		const translations = extractTranslations(contentData);

		expect(translations).toEqual([]);
	});
});
