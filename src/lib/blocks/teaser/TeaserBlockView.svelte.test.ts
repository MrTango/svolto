import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import TeaserBlockView from './TeaserBlockView.svelte';

// Task Group 1: Base structure tests for TeaserBlockView
describe('Teaser Block - Base Structure', () => {
	test('renders with minimal valid data', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Target Page Title',
					description: 'Target page description'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();
	});

	test('wraps content in a link to target href', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Target Page Title',
					description: 'Target page description'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const link = container.querySelector('a.teaser-item');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/my-page');
	});

	test('renders title as h2 element', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Target Page Title',
					description: 'Target page description'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const heading = container.querySelector('h2');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Target Page Title');
	});

	test('handles missing optional fields gracefully', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Only Title'
					// No description, no head_title
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Only Title');

		// Description should not be present
		const description = container.querySelector('.description');
		expect(description).not.toBeInTheDocument();
	});

	test('renders head_title (kicker) when present', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Main Title',
					head_title: 'Kicker Text'
				}
			],
			head_title: 'Kicker Text'
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const kicker = container.querySelector('.headline');
		expect(kicker).toBeInTheDocument();
		expect(kicker).toHaveTextContent('Kicker Text');
	});

	test('renders description when hide_description is not true', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Target Title',
					description: 'This is the description text'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const description = container.querySelector('.description');
		expect(description).toBeInTheDocument();
		expect(description).toHaveTextContent('This is the description text');
	});

	test('hides description when hide_description is true', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Target Title',
					description: 'This should be hidden'
				}
			],
			hide_description: true
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const description = container.querySelector('.description');
		expect(description).not.toBeInTheDocument();
	});

	test('uses overwritten content when data.overwrite is true', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Original Title',
					description: 'Original description'
				}
			],
			overwrite: true,
			title: 'Customized Title',
			description: 'Customized description'
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Customized Title');

		const description = container.querySelector('.description');
		expect(description).toHaveTextContent('Customized description');
	});
});

// Task Group 2: Responsive image handling tests for TeaserBlockView
describe('Teaser Block - Responsive Image Handling', () => {
	test('renders picture element with srcset when image data is present', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page with Image',
					description: 'Description',
					image_field: 'preview_image',
					hasPreviewImage: true,
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 },
									mini: { download: '@@images/preview_image-200.jpeg', width: 200, height: 150 },
									preview: { download: '@@images/preview_image-400.jpeg', width: 400, height: 300 }
								}
							}
						]
					}
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		const source = container.querySelector('picture source');
		expect(source).toBeInTheDocument();
		expect(source).toHaveAttribute('srcset');
	});

	test('builds srcset correctly from image_scales data', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page with Image',
					hasPreviewImage: true,
					image_field: 'preview_image',
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 },
									mini: { download: '@@images/preview_image-200.jpeg', width: 200, height: 150 }
								}
							}
						]
					}
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const source = container.querySelector('picture source');
		const srcset = source?.getAttribute('srcset') || '';

		// Check that srcset contains the scale entries with width descriptors
		expect(srcset).toContain('768w');
		expect(srcset).toContain('200w');
	});

	test('renders teaser without image-wrapper when no image data present', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page without Image',
					description: 'No image here'
					// No image_scales, no preview_image
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const imageWrapper = container.querySelector('.image-wrapper');
		expect(imageWrapper).not.toBeInTheDocument();

		// But the teaser should still render
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Page without Image');
	});

	test('applies loading="lazy" attribute to img element', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page with Image',
					hasPreviewImage: true,
					image_field: 'preview_image',
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 }
								}
							}
						]
					}
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const img = container.querySelector('picture img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('loading', 'lazy');
	});
});

// Task Group 3: Alignment functionality tests for TeaserBlockView
describe('Teaser Block - Alignment Options', () => {
	test('applies has--align--left class for left alignment', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Left Aligned Teaser'
				}
			],
			styles: {
				align: 'left'
			}
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toHaveClass('has--align--left');
	});

	test('applies has--align--right class for right alignment', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Right Aligned Teaser'
				}
			],
			styles: {
				align: 'right'
			}
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toHaveClass('has--align--right');
	});

	test('applies has--align--center class for center alignment', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Center Aligned Teaser'
				}
			],
			styles: {
				align: 'center'
			}
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toHaveClass('has--align--center');
	});

	test('defaults to left alignment when styles.align is not specified', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Default Aligned Teaser'
				}
			]
			// No styles.align specified
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toHaveClass('has--align--left');
	});

	test('alignment class is applied to block container element', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Teaser with alignment'
				}
			],
			styles: {
				align: 'right'
			}
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify alignment class is on the block container (.block.teaser)
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();
		expect(teaserBlock).toHaveClass('block');
		expect(teaserBlock).toHaveClass('teaser');
		expect(teaserBlock).toHaveClass('has--align--right');
	});
});

// Task Group 5: Event content-type template tests
describe('Teaser Block - Event Template', () => {
	test('displays event date correctly', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/my-event',
					'@type': 'Event',
					title: 'Annual Conference',
					description: 'Our yearly conference',
					start: '2025-03-15T09:00:00+00:00',
					end: '2025-03-15T17:00:00+00:00',
					whole_day: false
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check that event date info is rendered
		const eventInfo = container.querySelector('.event-info');
		expect(eventInfo).toBeInTheDocument();

		// Check that date text is present (format may vary by locale)
		const dateElement = container.querySelector('.event-date');
		expect(dateElement).toBeInTheDocument();
		expect(dateElement?.textContent).toContain('2025');
	});

	test('hides time when whole_day is true', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/all-day-event',
					'@type': 'Event',
					title: 'All Day Event',
					description: 'This is a whole day event',
					start: '2025-06-20T00:00:00+00:00',
					end: '2025-06-20T23:59:59+00:00',
					whole_day: true
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Time element should not be present for whole day events
		const timeElement = container.querySelector('.event-time');
		expect(timeElement).not.toBeInTheDocument();

		// But date should still show
		const dateElement = container.querySelector('.event-date');
		expect(dateElement).toBeInTheDocument();
	});

	test('displays time when whole_day is false', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/timed-event',
					'@type': 'Event',
					title: 'Morning Meeting',
					description: 'A timed event',
					start: '2025-04-10T10:30:00+00:00',
					end: '2025-04-10T12:00:00+00:00',
					whole_day: false
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Time element should be present
		const timeElement = container.querySelector('.event-time');
		expect(timeElement).toBeInTheDocument();
	});

	test('renders location when present', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/location-event',
					'@type': 'Event',
					title: 'Event with Location',
					description: 'Description of event',
					start: '2025-05-01T14:00:00+00:00',
					end: '2025-05-01T16:00:00+00:00',
					whole_day: false,
					location: 'Conference Room A, Building 1'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const locationElement = container.querySelector('.event-location');
		expect(locationElement).toBeInTheDocument();
		expect(locationElement?.textContent).toContain('Conference Room A, Building 1');
	});

	test('standard teaser fields still render in Event template', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/full-event',
					'@type': 'Event',
					title: 'Complete Event',
					description: 'Full event description',
					head_title: 'Featured Event',
					start: '2025-07-15T09:00:00+00:00',
					end: '2025-07-15T18:00:00+00:00',
					whole_day: false,
					location: 'Main Hall'
				}
			],
			head_title: 'Featured Event'
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check standard teaser elements
		const heading = container.querySelector('h2');
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Complete Event');

		const description = container.querySelector('.description');
		expect(description).toBeInTheDocument();
		expect(description).toHaveTextContent('Full event description');

		const headline = container.querySelector('.headline');
		expect(headline).toBeInTheDocument();
		expect(headline).toHaveTextContent('Featured Event');

		// Also check event-specific elements
		const eventInfo = container.querySelector('.event-info');
		expect(eventInfo).toBeInTheDocument();
	});
});

// Task Group 6: CSS and responsive behavior tests for TeaserBlockView
describe('Teaser Block - CSS and Responsive Styling', () => {
	test('teaser-item has default BEM modifier class', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Standard Teaser'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check that teaser-item has the default modifier class
		const teaserItem = container.querySelector('a.teaser-item');
		expect(teaserItem).toBeInTheDocument();
		expect(teaserItem).toHaveClass('teaser-item');
		expect(teaserItem).toHaveClass('default');
	});

	test('teaser-item has event BEM modifier class for Event content type', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/my-event',
					'@type': 'Event',
					title: 'Event Teaser',
					start: '2025-03-15T09:00:00+00:00',
					end: '2025-03-15T17:00:00+00:00',
					whole_day: false
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check that teaser-item has the event modifier class
		const teaserItem = container.querySelector('a.teaser-item');
		expect(teaserItem).toBeInTheDocument();
		expect(teaserItem).toHaveClass('teaser-item');
		expect(teaserItem).toHaveClass('event');
	});

	test('teaser without image has no-image modifier class', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page without Image',
					description: 'No image here'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check that teaser-item has the no-image modifier class
		const teaserItem = container.querySelector('a.teaser-item');
		expect(teaserItem).toBeInTheDocument();
		expect(teaserItem).toHaveClass('no-image');
	});

	test('teaser with image does not have no-image modifier class', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Page with Image',
					hasPreviewImage: true,
					image_field: 'preview_image',
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 }
								}
							}
						]
					}
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Check that teaser-item does NOT have the no-image modifier class
		const teaserItem = container.querySelector('a.teaser-item');
		expect(teaserItem).toBeInTheDocument();
		expect(teaserItem).not.toHaveClass('no-image');
	});
});

// Task Group 7: Integration and Edge Case Tests
describe('Teaser Block - Integration Tests', () => {
	test('renders full teaser with all elements (image, head_title, title, description)', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/my-page',
					'@type': 'Document',
					title: 'Full Featured Page',
					description: 'A complete description for the teaser',
					head_title: 'Featured',
					hasPreviewImage: true,
					image_field: 'preview_image',
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 },
									mini: { download: '@@images/preview_image-200.jpeg', width: 200, height: 150 }
								}
							}
						]
					}
				}
			],
			head_title: 'Featured',
			styles: {
				align: 'right'
			}
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify block structure
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();
		expect(teaserBlock).toHaveClass('has--align--right');

		// Verify link
		const link = container.querySelector('a.teaser-item');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/my-page');
		expect(link).toHaveClass('default');

		// Verify image
		const imageWrapper = container.querySelector('.image-wrapper');
		expect(imageWrapper).toBeInTheDocument();

		const picture = container.querySelector('picture');
		expect(picture).toBeInTheDocument();

		const source = container.querySelector('picture source');
		expect(source).toHaveAttribute('srcset');

		const img = container.querySelector('picture img');
		expect(img).toHaveAttribute('loading', 'lazy');

		// Verify content
		const headline = container.querySelector('.headline');
		expect(headline).toHaveTextContent('Featured');

		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Full Featured Page');

		const description = container.querySelector('.description');
		expect(description).toHaveTextContent('A complete description for the teaser');
	});

	test('renders Event teaser with image, date, time, and location', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/conference',
					'@type': 'Event',
					title: 'Tech Conference 2025',
					description: 'Annual technology conference',
					head_title: 'Upcoming',
					start: '2025-09-15T09:00:00+00:00',
					end: '2025-09-15T18:00:00+00:00',
					whole_day: false,
					location: 'Convention Center, Hall A',
					hasPreviewImage: true,
					image_field: 'preview_image',
					image_scales: {
						preview_image: [
							{
								download: '@@images/preview_image-800.jpeg',
								width: 800,
								height: 600,
								scales: {
									large: { download: '@@images/preview_image-768.jpeg', width: 768, height: 576 }
								}
							}
						]
					}
				}
			],
			head_title: 'Upcoming'
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Verify event modifier class
		const teaserItem = container.querySelector('a.teaser-item');
		expect(teaserItem).toHaveClass('event');

		// Verify image is present
		const imageWrapper = container.querySelector('.image-wrapper');
		expect(imageWrapper).toBeInTheDocument();

		// Verify event info
		const eventInfo = container.querySelector('.event-info');
		expect(eventInfo).toBeInTheDocument();

		// Verify date
		const dateElement = container.querySelector('.event-date');
		expect(dateElement).toBeInTheDocument();
		expect(dateElement?.textContent).toContain('2025');

		// Verify time (since whole_day is false)
		const timeElement = container.querySelector('.event-time');
		expect(timeElement).toBeInTheDocument();

		// Verify location
		const locationElement = container.querySelector('.event-location');
		expect(locationElement).toBeInTheDocument();
		expect(locationElement?.textContent).toContain('Convention Center, Hall A');

		// Verify standard teaser content
		const headline = container.querySelector('.headline');
		expect(headline).toHaveTextContent('Upcoming');

		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Tech Conference 2025');

		const description = container.querySelector('.description');
		expect(description).toHaveTextContent('Annual technology conference');
	});
});

describe('Teaser Block - Edge Cases', () => {
	test('handles empty href array gracefully', () => {
		const data = {
			href: []
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Block container should still render
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		// But no teaser-item link should be present
		const link = container.querySelector('a.teaser-item');
		expect(link).not.toBeInTheDocument();
	});

	test('handles missing href property gracefully', () => {
		const data = {};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Block container should still render
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		// But no teaser-item link should be present
		const link = container.querySelector('a.teaser-item');
		expect(link).not.toBeInTheDocument();
	});

	test('handles null data gracefully', () => {
		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data: null }
		});

		// Block container should still render
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		// But no teaser-item link should be present
		const link = container.querySelector('a.teaser-item');
		expect(link).not.toBeInTheDocument();
	});

	test('handles event without location gracefully', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/virtual-event',
					'@type': 'Event',
					title: 'Virtual Event',
					description: 'An online event with no physical location',
					start: '2025-08-01T14:00:00+00:00',
					end: '2025-08-01T16:00:00+00:00',
					whole_day: false
					// No location property
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Event info should be present
		const eventInfo = container.querySelector('.event-info');
		expect(eventInfo).toBeInTheDocument();

		// Date and time should be present
		const dateElement = container.querySelector('.event-date');
		expect(dateElement).toBeInTheDocument();

		const timeElement = container.querySelector('.event-time');
		expect(timeElement).toBeInTheDocument();

		// Location should NOT be present
		const locationElement = container.querySelector('.event-location');
		expect(locationElement).not.toBeInTheDocument();
	});

	test('handles multi-day event date range display', () => {
		const data = {
			href: [
				{
					'@id': 'http://localhost:8080/Plone/events/multi-day-event',
					'@type': 'Event',
					title: 'Multi-Day Conference',
					description: 'A conference spanning multiple days',
					start: '2025-10-15T09:00:00+00:00',
					end: '2025-10-17T18:00:00+00:00',
					whole_day: false,
					location: 'Conference Center'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Event date should show both start and end dates
		const dateElement = container.querySelector('.event-date');
		expect(dateElement).toBeInTheDocument();

		// Should contain both years (same year in this case, but the text should have date separator)
		const dateText = dateElement?.textContent || '';
		expect(dateText).toContain('2025');

		// Verify the date separator is present for multi-day events
		const dateSeparator = container.querySelector('.date-separator');
		expect(dateSeparator).toBeInTheDocument();
	});

	test('handles href target without @id property', () => {
		const data = {
			href: [
				{
					// Missing @id property
					'@type': 'Document',
					title: 'Page without ID'
				}
			]
		};

		const { container } = render(TeaserBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		// Teaser should still render
		const teaserBlock = container.querySelector('.block.teaser');
		expect(teaserBlock).toBeInTheDocument();

		// Link should have fallback href
		const link = container.querySelector('a.teaser-item');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '#');

		// Title should still display
		const heading = container.querySelector('h2');
		expect(heading).toHaveTextContent('Page without ID');
	});
});
