import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import DefaultTeaserTemplate from './DefaultTeaserTemplate.svelte';
import EventTeaserTemplate from './EventTeaserTemplate.svelte';

// Task Group 3: Tests for Teaser templates using ResponsiveImage
describe('DefaultTeaserTemplate - ResponsiveImage Integration', () => {
	test('renders ResponsiveImage when hasImage is true and scales are provided', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 },
			preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 }
		};

		const { container } = render(DefaultTeaserTemplate, {
			props: {
				hasImage: true,
				scales,
				imageBaseUrl: '/Plone/my-content',
				srcset: '',
				imageSrc: '/Plone/my-content/@@images/image.jpeg',
				imageAlt: 'Test teaser image',
				imageWidth: 800,
				imageHeight: 600,
				headTitle: 'Kicker',
				title: 'Test Title',
				description: 'Test description',
				showDescription: true
			}
		});

		// Verify picture element is rendered via ResponsiveImage
		const picture = container.querySelector('.image-wrapper picture');
		expect(picture).toBeInTheDocument();

		// Verify source element has srcset with width descriptors
		const source = container.querySelector('.image-wrapper picture source');
		expect(source).toBeInTheDocument();
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).toContain('768w');
		expect(srcset).toContain('400w');

		// Verify img has teaser-image class
		const img = container.querySelector('.image-wrapper picture img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveClass('teaser-image');
	});

	test('preserves image-wrapper div for layout styling', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 }
		};

		const { container } = render(DefaultTeaserTemplate, {
			props: {
				hasImage: true,
				scales,
				imageBaseUrl: '/Plone/my-content',
				srcset: '',
				imageSrc: '/Plone/my-content/@@images/image.jpeg',
				imageAlt: 'Test image',
				imageWidth: 800,
				imageHeight: 600,
				headTitle: '',
				title: 'Test',
				description: '',
				showDescription: false
			}
		});

		// Verify image-wrapper div exists and contains the ResponsiveImage
		const imageWrapper = container.querySelector('.image-wrapper');
		expect(imageWrapper).toBeInTheDocument();
		expect(imageWrapper?.querySelector('picture')).toBeInTheDocument();
	});
});

describe('EventTeaserTemplate - ResponsiveImage Integration', () => {
	test('renders ResponsiveImage when hasImage is true and scales are provided', () => {
		const scales = {
			large: { download: '@@images/image-768.jpeg', width: 768, height: 576 },
			mini: { download: '@@images/image-200.jpeg', width: 200, height: 150 }
		};

		const { container } = render(EventTeaserTemplate, {
			props: {
				hasImage: true,
				scales,
				imageBaseUrl: '/Plone/my-event',
				srcset: '',
				imageSrc: '/Plone/my-event/@@images/image.jpeg',
				imageAlt: 'Event image',
				imageWidth: 800,
				imageHeight: 600,
				headTitle: 'Event Kicker',
				title: 'Event Title',
				description: 'Event description',
				showDescription: true,
				target: {
					start: '2024-03-15T10:00:00',
					end: '2024-03-15T12:00:00',
					location: 'Test Location'
				}
			}
		});

		// Verify picture element is rendered via ResponsiveImage
		const picture = container.querySelector('.image-wrapper picture');
		expect(picture).toBeInTheDocument();

		// Verify source element has srcset with width descriptors
		const source = container.querySelector('.image-wrapper picture source');
		expect(source).toBeInTheDocument();
		const srcset = source?.getAttribute('srcset') || '';
		expect(srcset).toContain('768w');
		expect(srcset).toContain('200w');

		// Verify img has teaser-image class
		const img = container.querySelector('.image-wrapper picture img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveClass('teaser-image');
	});

	test('passes correct props through from TeaserBlockView', () => {
		const scales = {
			preview: { download: '@@images/image-400.jpeg', width: 400, height: 300 }
		};

		const { container } = render(EventTeaserTemplate, {
			props: {
				hasImage: true,
				scales,
				imageBaseUrl: '/Plone/events/my-event',
				srcset: '',
				imageSrc: '/Plone/events/my-event/@@images/image.jpeg',
				imageAlt: 'My Event Alt Text',
				imageWidth: 1200,
				imageHeight: 800,
				headTitle: '',
				title: 'My Event',
				description: '',
				showDescription: false,
				target: null
			}
		});

		const img = container.querySelector('.image-wrapper picture img');
		expect(img).toHaveAttribute('alt', 'My Event Alt Text');
		expect(img).toHaveAttribute('width', '1200');
		expect(img).toHaveAttribute('height', '800');
		expect(img).toHaveAttribute('loading', 'lazy');
	});
});
