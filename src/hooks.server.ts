import { API_PATH } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import {
	fetchSiteSettings,
	detectLanguageFromHeaders,
	fetchContentTranslations,
	extractLanguageFromPath,
	extractRelativePathFromUrl
} from '$lib/plone/site';
import { LANGUAGE_COOKIE_NAME } from '$lib/utils/language-cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Image and download proxy - handle first
	if (pathname.includes('@@images') || pathname.includes('@@download')) {
		const backendUrl = `${API_PATH}${pathname}`;

		try {
			const response = await fetch(backendUrl);

			if (!response.ok) {
				return new Response(null, { status: response.status });
			}

			return new Response(response.body, {
				status: response.status,
				headers: {
					'content-type': response.headers.get('content-type') || 'application/octet-stream',
					'cache-control': response.headers.get('cache-control') || 'public, max-age=31536000'
				}
			});
		} catch {
			return new Response(null, { status: 502 });
		}
	}

	// Root-level language redirection for multilingual sites
	if (pathname === '/') {
		try {
			const siteSettings = await fetchSiteSettings(API_PATH);

			// Only redirect when multilingual is enabled (more than 1 language)
			if (siteSettings.availableLanguages.length > 1) {
				// Read language preference from cookie
				const cookieLang = event.cookies.get(LANGUAGE_COOKIE_NAME);

				// Get Accept-Language header
				const acceptLanguageHeader = event.request.headers.get('Accept-Language');

				// Detect target language using priority order
				const targetLanguage = detectLanguageFromHeaders(
					cookieLang,
					acceptLanguageHeader,
					siteSettings.availableLanguages,
					siteSettings.useRequestNegotiation,
					siteSettings.defaultLanguage
				);

				// Redirect to language folder with 307 (temporary redirect)
				redirect(307, `/${targetLanguage}/`);
			}
		} catch (error) {
			// If redirect was thrown, re-throw it
			if (error && typeof error === 'object' && 'status' in error) {
				throw error;
			}
			// Log other errors but continue to normal resolve
			console.error('[hooks.server] Error during root redirect:', error);
		}
	}

	// Content page language redirection for multilingual sites
	if (pathname !== '/') {
		try {
			// Read language preference from cookie
			const cookieLang = event.cookies.get(LANGUAGE_COOKIE_NAME);

			// Only proceed if user has a language preference cookie
			if (cookieLang) {
				const siteSettings = await fetchSiteSettings(API_PATH);

				// Only redirect when multilingual is enabled
				if (siteSettings.availableLanguages.length > 1) {
					// Check if cookie language is valid
					if (siteSettings.availableLanguages.includes(cookieLang)) {
						// Extract current language from URL path
						const currentLang = extractLanguageFromPath(
							pathname,
							siteSettings.availableLanguages
						);

						// Skip redirect if already in preferred language
						if (currentLang !== cookieLang) {
							// Fetch translations for current content
							const translations = await fetchContentTranslations(pathname, API_PATH);

							// Find translation in preferred language
							const targetTranslation = translations.find((t) => t.language === cookieLang);

							if (targetTranslation) {
								// Extract relative path from full Plone URL
								const targetPath = extractRelativePathFromUrl(
									targetTranslation['@id'],
									API_PATH
								);

								// Redirect to translation with 307 (temporary redirect)
								redirect(307, targetPath);
							}
						}
					}
				}
			}
		} catch (error) {
			// If redirect was thrown, re-throw it
			if (error && typeof error === 'object' && 'status' in error) {
				throw error;
			}
			// Log other errors but continue to normal resolve
			console.error('[hooks.server] Error during content page redirect:', error);
		}
	}

	return resolve(event);
};
