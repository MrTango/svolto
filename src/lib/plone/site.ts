import { PUBLIC_API_PATH } from '$env/static/public';

export interface SiteSettings {
	availableLanguages: string[];
	defaultLanguage: string;
	useCookieNegotiation: boolean;
	useRequestNegotiation: boolean;
}

export interface Translation {
	'@id': string;
	language: string;
}

interface PloneSiteResponse {
	'plone.available_languages'?: string[];
	'plone.default_language'?: string;
	'plone.use_cookie_negotiation'?: boolean;
	'plone.use_request_negotiation'?: boolean;
}

interface TranslationsResponse {
	'@id': string;
	items?: Translation[];
}

export async function fetchSiteSettings(apiPathOverride?: string): Promise<SiteSettings> {
	const apiPath = apiPathOverride ?? PUBLIC_API_PATH ?? '';

	try {
		const response = await fetch(`${apiPath}/@site`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Site API request failed: ${response.status} ${response.statusText}`);
		}

		const data: PloneSiteResponse = await response.json();

		return {
			availableLanguages: data['plone.available_languages'] ?? ['en'],
			defaultLanguage: data['plone.default_language'] ?? 'en',
			useCookieNegotiation: data['plone.use_cookie_negotiation'] ?? false,
			useRequestNegotiation: data['plone.use_request_negotiation'] ?? false
		};
	} catch (error) {
		console.error('Error fetching site settings:', error);
		return {
			availableLanguages: ['en'],
			defaultLanguage: 'en',
			useCookieNegotiation: false,
			useRequestNegotiation: false
		};
	}
}

export async function fetchContentTranslations(
	path: string,
	apiPath: string
): Promise<Translation[]> {
	try {
		const cleanPath = path.startsWith('/') ? path : `/${path}`;
		const response = await fetch(`${apiPath}${cleanPath}/@translations`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			return [];
		}

		const data: TranslationsResponse = await response.json();
		return data.items ?? [];
	} catch {
		return [];
	}
}

export function extractLanguageFromPath(
	pathname: string,
	availableLanguages: string[]
): string | undefined {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) {
		return undefined;
	}

	const firstSegment = segments[0];
	if (availableLanguages.includes(firstSegment)) {
		return firstSegment;
	}

	return undefined;
}

export function extractRelativePathFromUrl(
	fullUrl: string,
	apiPath: string
): string {
	try {
		const url = new URL(fullUrl);
		const apiUrl = new URL(apiPath);

		// Remove the API base path from the URL pathname
		const apiBasePath = apiUrl.pathname.replace(/\/$/, '');
		let relativePath = url.pathname;

		if (relativePath.startsWith(apiBasePath)) {
			relativePath = relativePath.slice(apiBasePath.length);
		}

		// Ensure path starts with /
		if (!relativePath.startsWith('/')) {
			relativePath = '/' + relativePath;
		}

		return relativePath;
	} catch {
		return fullUrl;
	}
}

export function parseAcceptLanguage(header: string | undefined | null): string[] {
	if (!header) {
		return [];
	}

	return header
		.split(',')
		.map((part) => {
			const [lang, qValue] = part.trim().split(';q=');
			return {
				lang: lang.trim(),
				q: qValue ? parseFloat(qValue) : 1.0
			};
		})
		.sort((a, b) => b.q - a.q)
		.map((item) => item.lang);
}

export function detectLanguageFromHeaders(
	cookieLang: string | undefined,
	acceptLanguageHeader: string | undefined | null,
	availableLanguages: string[],
	useRequestNegotiation: boolean,
	defaultLanguage: string
): string {
	// 1. Cookie takes highest priority
	if (cookieLang && availableLanguages.includes(cookieLang)) {
		return cookieLang;
	}

	// 2. Accept-Language header (only when request negotiation is enabled)
	if (useRequestNegotiation && acceptLanguageHeader) {
		const preferredLanguages = parseAcceptLanguage(acceptLanguageHeader);

		for (const lang of preferredLanguages) {
			// Try exact match first
			if (availableLanguages.includes(lang)) {
				return lang;
			}
			// Try base language (e.g., 'de' from 'de-DE')
			const baseLang = lang.split('-')[0];
			if (availableLanguages.includes(baseLang)) {
				return baseLang;
			}
		}
	}

	// 3. Fall back to default language
	return defaultLanguage;
}

export function extractTranslations(
	contentData: Record<string, unknown>
): Translation[] {
	const components = contentData['@components'] as
		| { translations?: { items?: Translation[] } }
		| undefined;
	return components?.translations?.items ?? [];
}
