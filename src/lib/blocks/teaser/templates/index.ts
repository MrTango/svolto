import type { Component } from 'svelte';
import DefaultTeaserTemplate from './DefaultTeaserTemplate.svelte';
import EventTeaserTemplate from './EventTeaserTemplate.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TeaserTemplateComponent = Component<any, any, any>;

/**
 * Template registry keyed by Plone content type.
 * Maps content types to their specific teaser template components.
 */
export const templateRegistry: Record<string, TeaserTemplateComponent> = {
	Event: EventTeaserTemplate
};

/**
 * Get the appropriate template component for a given content type.
 * Returns the default template if no content-type specific template exists.
 *
 * @param contentType - The Plone content type (e.g., 'Event', 'Document')
 * @returns The template component to use for rendering
 */
export function getTemplateForContentType(contentType: string | undefined): TeaserTemplateComponent {
	if (!contentType) {
		return DefaultTeaserTemplate;
	}

	return templateRegistry[contentType] || DefaultTeaserTemplate;
}

export { DefaultTeaserTemplate, EventTeaserTemplate };
