import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('$env/static/private', () => ({
	API_PATH: 'http://localhost:8080/Plone'
}));

const mockFetchSiteSettings = vi.fn();
const mockParseAcceptLanguage = vi.fn();
const mockDetectLanguageFromHeaders = vi.fn();
const mockFetchContentTranslations = vi.fn();
const mockExtractLanguageFromPath = vi.fn();
const mockExtractRelativePathFromUrl = vi.fn();

vi.mock('$lib/plone/site', () => ({
	fetchSiteSettings: () => mockFetchSiteSettings(),
	parseAcceptLanguage: (header: string) => mockParseAcceptLanguage(header),
	detectLanguageFromHeaders: (...args: unknown[]) => mockDetectLanguageFromHeaders(...args),
	fetchContentTranslations: (path: string, apiPath: string) =>
		mockFetchContentTranslations(path, apiPath),
	extractLanguageFromPath: (pathname: string, availableLanguages: string[]) =>
		mockExtractLanguageFromPath(pathname, availableLanguages),
	extractRelativePathFromUrl: (fullUrl: string, apiPath: string) =>
		mockExtractRelativePathFromUrl(fullUrl, apiPath)
}));

describe('Root-Level Language Redirection', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.resetAllMocks();
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	test('root URL (/) redirects to detected language folder when multilingual enabled', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockDetectLanguageFromHeaders.mockReturnValue('de');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/'),
			request: {
				headers: new Headers({
					'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
					cookie: ''
				})
			},
			cookies: {
				get: vi.fn().mockReturnValue(undefined)
			}
		};

		const mockResolve = vi.fn();

		await expect(
			handle({ event: mockEvent as any, resolve: mockResolve })
		).rejects.toMatchObject({
			status: 307,
			location: '/de/'
		});

		expect(mockResolve).not.toHaveBeenCalled();
	});

	test('redirect respects cookie preference over Accept-Language', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockDetectLanguageFromHeaders.mockReturnValue('fr');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/'),
			request: {
				headers: new Headers({
					'Accept-Language': 'de-DE,de;q=0.9',
					cookie: 'I18N_LANGUAGE=fr'
				})
			},
			cookies: {
				get: vi.fn().mockReturnValue('fr')
			}
		};

		const mockResolve = vi.fn();

		await expect(
			handle({ event: mockEvent as any, resolve: mockResolve })
		).rejects.toMatchObject({
			status: 307,
			location: '/fr/'
		});
	});

	test('redirect uses default language when no preference detected', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: false,
			useRequestNegotiation: false
		});
		mockDetectLanguageFromHeaders.mockReturnValue('en');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue(undefined)
			}
		};

		const mockResolve = vi.fn();

		await expect(
			handle({ event: mockEvent as any, resolve: mockResolve })
		).rejects.toMatchObject({
			status: 307,
			location: '/en/'
		});
	});

	test('no redirect occurs when site is not multilingual', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en'],
			defaultLanguage: 'en',
			useCookieNegotiation: false,
			useRequestNegotiation: false
		});

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue(undefined)
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
	});

	test('existing image proxy functionality is preserved', async () => {
		vi.mocked(globalThis.fetch).mockResolvedValue({
			ok: true,
			status: 200,
			body: 'image-data',
			headers: new Headers({
				'content-type': 'image/jpeg',
				'cache-control': 'public, max-age=31536000'
			})
		} as any);

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/image/@@images/image/large'),
			request: {
				headers: new Headers({})
			}
		};

		const mockResolve = vi.fn();

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).not.toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(200);
	});
});

describe('Content Page Language Redirection', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.resetAllMocks();
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	test('content page redirects to translation when cookie is set and translation exists', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockExtractLanguageFromPath.mockReturnValue('en');
		mockFetchContentTranslations.mockResolvedValue([
			{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' },
			{ '@id': 'http://localhost:8080/Plone/de/seite', language: 'de' }
		]);
		mockExtractRelativePathFromUrl.mockReturnValue('/de/seite');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/en/page'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue('de')
			}
		};

		const mockResolve = vi.fn();

		await expect(
			handle({ event: mockEvent as any, resolve: mockResolve })
		).rejects.toMatchObject({
			status: 307,
			location: '/de/seite'
		});

		expect(mockResolve).not.toHaveBeenCalled();
		expect(mockExtractRelativePathFromUrl).toHaveBeenCalledWith(
			'http://localhost:8080/Plone/de/seite',
			'http://localhost:8080/Plone'
		);
	});

	test('content page does NOT redirect when no translation exists for preferred language', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockExtractLanguageFromPath.mockReturnValue('en');
		mockFetchContentTranslations.mockResolvedValue([
			{ '@id': 'http://localhost:8080/Plone/en/page', language: 'en' }
		]);

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/en/page'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue('de')
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
	});

	test('content page does NOT redirect when already in preferred language', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockExtractLanguageFromPath.mockReturnValue('de');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/de/seite'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue('de')
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
		expect(mockFetchContentTranslations).not.toHaveBeenCalled();
	});

	test('content page does NOT redirect when no cookie is set', async () => {
		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/en/page'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue(undefined)
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
		expect(mockFetchSiteSettings).not.toHaveBeenCalled();
	});

	test('content page does NOT redirect when cookie language is not in available languages', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockExtractLanguageFromPath.mockReturnValue('en');

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/en/page'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue('es') // Spanish not in available languages
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
		expect(mockFetchContentTranslations).not.toHaveBeenCalled();
	});

	test('content page continues normally when translation fetch fails (graceful degradation)', async () => {
		mockFetchSiteSettings.mockResolvedValue({
			availableLanguages: ['en', 'de', 'fr'],
			defaultLanguage: 'en',
			useCookieNegotiation: true,
			useRequestNegotiation: true
		});
		mockExtractLanguageFromPath.mockReturnValue('en');
		mockFetchContentTranslations.mockResolvedValue([]); // Empty array simulates fetch failure

		const { handle } = await import('./hooks.server');

		const mockEvent = {
			url: new URL('http://localhost:5173/en/page'),
			request: {
				headers: new Headers({})
			},
			cookies: {
				get: vi.fn().mockReturnValue('de')
			}
		};

		const mockResolve = vi.fn().mockResolvedValue(new Response('ok'));

		const result = await handle({ event: mockEvent as any, resolve: mockResolve });

		expect(mockResolve).toHaveBeenCalled();
		expect(result).toBeInstanceOf(Response);
	});
});
