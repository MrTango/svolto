import type { Cookies } from '@sveltejs/kit';

export const LANGUAGE_COOKIE_NAME = 'I18N_LANGUAGE';
const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 180;

export function getLanguageCookie(cookies: Cookies): string | undefined {
	return cookies.get(LANGUAGE_COOKIE_NAME);
}

export function setLanguageCookie(cookies: Cookies, lang: string): void {
	cookies.set(LANGUAGE_COOKIE_NAME, lang, {
		maxAge: SIX_MONTHS_IN_SECONDS,
		sameSite: 'strict',
		path: '/',
		secure: true
	});
}

export function getLanguageCookieClient(): string | undefined {
	if (typeof document === 'undefined') return undefined;

	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === LANGUAGE_COOKIE_NAME) {
			return value;
		}
	}
	return undefined;
}

export function setLanguageCookieClient(lang: string): void {
	if (typeof document === 'undefined') return;

	const isSecure = typeof location !== 'undefined' && location.protocol === 'https:';

	let cookieString = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=${SIX_MONTHS_IN_SECONDS}; SameSite=Strict`;

	if (isSecure) {
		cookieString += '; Secure';
	}

	document.cookie = cookieString;
}
