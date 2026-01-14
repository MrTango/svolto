import { describe, test, expect } from 'vitest';
import { langmap, normalizeLang } from './langmap';

describe('langmap - native language names', () => {
	test('returns correct native names for common languages (en, de, fr)', () => {
		expect(langmap['en'].nativeName).toBe('English');
		expect(langmap['en'].englishName).toBe('English');

		expect(langmap['de'].nativeName).toBe('Deutsch');
		expect(langmap['de'].englishName).toBe('German');

		expect(langmap['fr'].nativeName).toBe('Français');
		expect(langmap['fr'].englishName).toBe('French');
	});

	test('Proxy resolves normalized language codes dynamically', () => {
		// Accessing via Proxy should auto-normalize language codes
		expect(langmap['en-us']?.nativeName).toBe('English (US)');
		expect(langmap['en_US']?.nativeName).toBe('English (US)');
		expect(langmap['de-de']?.nativeName).toBe('Deutsch (Deutschland)');
	});

	test('returns undefined for unknown language codes', () => {
		// Unknown language codes should return undefined
		expect(langmap['xyz']).toBeUndefined();
		expect(langmap['unknown-LANG']).toBeUndefined();
	});
});

describe('normalizeLang - language code normalization', () => {
	test('handles underscore variants (en_US -> en-US)', () => {
		expect(normalizeLang('en_US')).toBe('en-US');
		expect(normalizeLang('de_DE')).toBe('de-DE');
		expect(normalizeLang('fr_CA')).toBe('fr-CA');
	});

	test('handles lowercase variants (en-us -> en-US)', () => {
		expect(normalizeLang('en-us')).toBe('en-US');
		expect(normalizeLang('de-de')).toBe('de-DE');
		expect(normalizeLang('fr-fr')).toBe('fr-FR');
	});

	test('returns base language codes unchanged', () => {
		expect(normalizeLang('en')).toBe('en');
		expect(normalizeLang('de')).toBe('de');
		expect(normalizeLang('fr')).toBe('fr');
	});
});
