import { describe, test, expect } from 'vitest';
import { getTemplateForContentType, templateRegistry } from './index';
import DefaultTeaserTemplate from './DefaultTeaserTemplate.svelte';
import EventTeaserTemplate from './EventTeaserTemplate.svelte';

// Task Group 4: Template registration tests
describe('Teaser Block - Template Registration', () => {
	test('getTemplateForContentType("Event") returns EventTeaserTemplate', () => {
		const template = getTemplateForContentType('Event');
		expect(template).toBe(EventTeaserTemplate);
	});

	test('getTemplateForContentType("Document") returns default template', () => {
		const template = getTemplateForContentType('Document');
		expect(template).toBe(DefaultTeaserTemplate);
	});

	test('getTemplateForContentType(undefined) returns default template', () => {
		const template = getTemplateForContentType(undefined);
		expect(template).toBe(DefaultTeaserTemplate);
	});

	test('template registry exports correctly', () => {
		// Verify registry object exists and has expected structure
		expect(templateRegistry).toBeDefined();
		expect(typeof templateRegistry).toBe('object');

		// Verify Event is registered
		expect(templateRegistry['Event']).toBe(EventTeaserTemplate);

		// Verify getTemplateForContentType is exported as a function
		expect(typeof getTemplateForContentType).toBe('function');
	});
});
