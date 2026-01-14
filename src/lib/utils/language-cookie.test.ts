import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getLanguageCookie,
	setLanguageCookie,
	getLanguageCookieClient,
	setLanguageCookieClient,
	LANGUAGE_COOKIE_NAME
} from './language-cookie';

describe('server-side language cookie utilities', () => {
	test('reads I18N_LANGUAGE cookie value', () => {
		const mockCookies = {
			get: vi.fn().mockReturnValue('de')
		};

		const result = getLanguageCookie(mockCookies as any);

		expect(mockCookies.get).toHaveBeenCalledWith(LANGUAGE_COOKIE_NAME);
		expect(result).toBe('de');
	});

	test('writes cookie with correct options (6 months, SameSite: strict)', () => {
		const mockCookies = {
			set: vi.fn()
		};

		setLanguageCookie(mockCookies as any, 'fr');

		expect(mockCookies.set).toHaveBeenCalledWith(
			LANGUAGE_COOKIE_NAME,
			'fr',
			expect.objectContaining({
				maxAge: 60 * 60 * 24 * 180, // 6 months in seconds
				sameSite: 'strict',
				path: '/'
			})
		);
	});
});

describe('client-side language cookie utilities', () => {
	let originalDocument: typeof globalThis.document;

	beforeEach(() => {
		originalDocument = globalThis.document;
		Object.defineProperty(globalThis, 'document', {
			value: {
				cookie: ''
			},
			writable: true,
			configurable: true
		});
	});

	afterEach(() => {
		Object.defineProperty(globalThis, 'document', {
			value: originalDocument,
			writable: true,
			configurable: true
		});
	});

	test('setLanguageCookieClient sets cookie with correct value and attributes', () => {
		setLanguageCookieClient('de');

		const cookieString = document.cookie;

		expect(cookieString).toContain('I18N_LANGUAGE=de');
		expect(cookieString).toContain('path=/');
		expect(cookieString).toContain('max-age=15552000');
		expect(cookieString).toContain('SameSite=Strict');
	});

	test('setLanguageCookieClient includes Secure attribute on HTTPS', () => {
		Object.defineProperty(globalThis, 'location', {
			value: { protocol: 'https:' },
			writable: true,
			configurable: true
		});

		setLanguageCookieClient('fr');

		const cookieString = document.cookie;
		expect(cookieString).toContain('Secure');

		Object.defineProperty(globalThis, 'location', {
			value: undefined,
			writable: true,
			configurable: true
		});
	});

	test('getLanguageCookieClient reads cookie value correctly', () => {
		document.cookie = 'other=value; I18N_LANGUAGE=en; another=test';

		const result = getLanguageCookieClient();

		expect(result).toBe('en');
	});

	test('getLanguageCookieClient returns undefined when cookie not present', () => {
		document.cookie = 'other=value; another=test';

		const result = getLanguageCookieClient();

		expect(result).toBeUndefined();
	});
});
