import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import TocBlockView from './TocBlockView.svelte';
import DefaultVariation from './variations/DefaultVariation.svelte';
import HorizontalVariation from './variations/HorizontalVariation.svelte';
import type { TocEntry } from './types';

const defaultProps = {
	metadata: {},
	path: '/',
	blocksConfig: {}
};

const mockEntries: TocEntry[] = [
	{ level: 2, title: 'First Section', id: 'block-1-first-section', children: [] },
	{ level: 3, title: 'Subsection A', id: 'block-2-subsection-a', children: [] },
	{ level: 2, title: 'Second Section', id: 'block-3-second-section', children: [] }
];

const mockProperties = {
	blocks: {
		'block-1': {
			'@type': 'slate',
			value: [{ type: 'h2', children: [{ text: 'First Section' }] }]
		},
		'block-2': {
			'@type': 'slate',
			value: [{ type: 'h3', children: [{ text: 'Subsection A' }] }]
		},
		'block-3': {
			'@type': 'slate',
			value: [{ type: 'h2', children: [{ text: 'Second Section' }] }]
		}
	},
	blocks_layout: {
		items: ['block-1', 'block-2', 'block-3']
	}
};

describe('TocBlockView', () => {
	test('renders with extracted headings from properties.blocks', () => {
		const data = {};

		const { container } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data,
				properties: mockProperties
			}
		});

		const nav = container.querySelector('nav');
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute('aria-label', 'Table of Contents');

		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(3);
		expect(links[0]).toHaveAttribute('href', '#block-1-first-section');
		expect(links[0].textContent).toContain('First Section');
	});

	test('selects correct variation based on data.variation prop', () => {
		const { container: containerDefault } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data: { variation: 'default' },
				properties: mockProperties
			}
		});

		expect(containerDefault.querySelector('.toc-default')).toBeInTheDocument();

		const { container: containerHorizontal } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-2',
				id: 'toc-2',
				data: { variation: 'horizontalMenu' },
				properties: mockProperties
			}
		});

		expect(containerHorizontal.querySelector('.toc-horizontal')).toBeInTheDocument();
	});

	test('displays empty state message when no headings found', () => {
		const emptyProperties = {
			blocks: {
				'block-1': {
					'@type': 'slate',
					value: [{ type: 'p', children: [{ text: 'Just a paragraph, no headings' }] }]
				}
			},
			blocks_layout: {
				items: ['block-1']
			}
		};

		const { container } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data: {},
				properties: emptyProperties
			}
		});

		const emptyMessage = container.querySelector('.toc-empty');
		expect(emptyMessage).toBeInTheDocument();
		expect(emptyMessage?.textContent).toBe('No headings found on this page.');
	});

	test('displays title when provided and hide_title is false', () => {
		const { container: withTitle } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data: { title: 'Page Navigation' },
				properties: mockProperties
			}
		});

		const title = withTitle.querySelector('.toc-title');
		expect(title).toBeInTheDocument();
		expect(title?.textContent).toBe('Page Navigation');

		const { container: hiddenTitle } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-2',
				id: 'toc-2',
				data: { title: 'Hidden Title', hide_title: true },
				properties: mockProperties
			}
		});

		expect(hiddenTitle.querySelector('.toc-title')).not.toBeInTheDocument();
	});

	test('uses custom title as aria-label when provided', () => {
		const { container } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data: { title: 'Custom Navigation' },
				properties: mockProperties
			}
		});

		const nav = container.querySelector('nav');
		expect(nav).toHaveAttribute('aria-label', 'Custom Navigation');
	});

	test('filters headings by configured levels', () => {
		const mixedProperties = {
			blocks: {
				'block-1': {
					'@type': 'slate',
					value: [
						{ type: 'h2', children: [{ text: 'H2 Heading' }] },
						{ type: 'h3', children: [{ text: 'H3 Heading' }] },
						{ type: 'h4', children: [{ text: 'H4 Heading' }] }
					]
				}
			},
			blocks_layout: {
				items: ['block-1']
			}
		};

		const { container } = render(TocBlockView, {
			props: {
				...defaultProps,
				key: 'toc-1',
				id: 'toc-1',
				data: { levels: ['h2'] },
				properties: mixedProperties
			}
		});

		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(1);
		expect(links[0].textContent).toBe('H2 Heading');
	});
});

describe('DefaultVariation', () => {
	test('renders nested list structure with anchor links', () => {
		const { container } = render(DefaultVariation, {
			props: { entries: mockEntries, ordered: false }
		});

		const list = container.querySelector('.toc-default ul');
		expect(list).toBeInTheDocument();

		const listItems = container.querySelectorAll('li');
		expect(listItems).toHaveLength(3);

		const firstLink = container.querySelector('a[href="#block-1-first-section"]');
		expect(firstLink).toBeInTheDocument();
		expect(firstLink?.textContent).toBe('First Section');
	});

	test('renders ordered list when ordered prop is true', () => {
		const { container } = render(DefaultVariation, {
			props: { entries: mockEntries, ordered: true }
		});

		const orderedList = container.querySelector('.toc-default ol');
		expect(orderedList).toBeInTheDocument();

		const unorderedList = container.querySelector('.toc-default > ul');
		expect(unorderedList).not.toBeInTheDocument();
	});
});

describe('HorizontalVariation', () => {
	test('renders flat horizontal menu with all entries at same level', () => {
		const { container } = render(HorizontalVariation, {
			props: { entries: mockEntries, sticky: false }
		});

		const menu = container.querySelector('.toc-horizontal');
		expect(menu).toBeInTheDocument();

		const list = container.querySelector('ul');
		expect(list).toBeInTheDocument();

		const listItems = container.querySelectorAll('li');
		expect(listItems).toHaveLength(3);

		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(3);
		expect(links[0]).toHaveAttribute('href', '#block-1-first-section');
	});

	test('applies sticky positioning when sticky prop is true', () => {
		const { container } = render(HorizontalVariation, {
			props: { entries: mockEntries, sticky: true }
		});

		const menu = container.querySelector('.toc-horizontal');
		expect(menu).toHaveClass('toc-sticky');
	});
});
