import { describe, test, expect } from 'vitest';
import {
	generateSlug,
	generateAnchorId,
	extractTextFromSlateNode,
	extractHeadingsFromBlocks
} from './utils';
import type { PageBlocks, BlocksLayout } from './types';

describe('TOC Utility Functions', () => {
	describe('generateSlug', () => {
		test('converts plain text to lowercase hyphen-separated slug', () => {
			expect(generateSlug('Hello World')).toBe('hello-world');
			expect(generateSlug('Introduction to Plone')).toBe('introduction-to-plone');
			expect(generateSlug('Quick Start Guide')).toBe('quick-start-guide');
		});

		test('handles unicode and diacritics via normalization', () => {
			// French accented characters
			expect(generateSlug('Cafe Resume')).toBe('cafe-resume');
			expect(generateSlug('Ecole Francaise')).toBe('ecole-francaise');
			// German umlauts
			expect(generateSlug('Uber die Bruecke')).toBe('uber-die-bruecke');
			// Spanish tilde
			expect(generateSlug('Senor Espanol')).toBe('senor-espanol');
		});

		test('removes special characters and normalizes hyphens', () => {
			expect(generateSlug('Hello, World!')).toBe('hello-world');
			expect(generateSlug('Section 1: Getting Started')).toBe('section-1-getting-started');
			expect(generateSlug('What is this?')).toBe('what-is-this');
			expect(generateSlug('a---b')).toBe('a-b');
			expect(generateSlug('-leading-trailing-')).toBe('leading-trailing');
		});

		test('handles edge cases', () => {
			expect(generateSlug('')).toBe('');
			expect(generateSlug('   ')).toBe('');
			expect(generateSlug('123')).toBe('123');
			expect(generateSlug('_underscores_here_')).toBe('underscores-here');
		});
	});

	describe('generateAnchorId', () => {
		test('generates unique ID with block ID prefix', () => {
			expect(generateAnchorId('block-123', 'Hello World')).toBe('block-123-hello-world');
			expect(generateAnchorId('abc-def-ghi', 'Introduction')).toBe('abc-def-ghi-introduction');
		});

		test('handles empty text by returning just block ID', () => {
			expect(generateAnchorId('block-123', '')).toBe('block-123');
			expect(generateAnchorId('block-123', '   ')).toBe('block-123');
		});
	});

	describe('extractTextFromSlateNode', () => {
		test('extracts text from text nodes', () => {
			const node = { text: 'Hello World' };
			expect(extractTextFromSlateNode(node)).toBe('Hello World');
		});

		test('extracts and concatenates text from nested children', () => {
			const node = {
				type: 'h2',
				children: [
					{ text: 'Hello ' },
					{
						type: 'strong',
						children: [{ text: 'World' }]
					}
				]
			};
			expect(extractTextFromSlateNode(node)).toBe('Hello World');
		});

		test('handles deeply nested structures', () => {
			const node = {
				type: 'h2',
				children: [
					{ text: 'Start ' },
					{
						type: 'link',
						children: [
							{ text: 'middle ' },
							{
								type: 'strong',
								children: [{ text: 'deep' }]
							}
						]
					},
					{ text: ' end' }
				]
			};
			expect(extractTextFromSlateNode(node)).toBe('Start middle deep end');
		});
	});

	describe('extractHeadingsFromBlocks', () => {
		test('extracts headings from slate blocks in layout order', () => {
			const blocks: PageBlocks = {
				'block-1': {
					'@type': 'slate',
					value: [
						{
							type: 'h2',
							children: [{ text: 'First Heading' }]
						},
						{
							type: 'p',
							children: [{ text: 'Some paragraph text' }]
						}
					]
				},
				'block-2': {
					'@type': 'slate',
					value: [
						{
							type: 'h3',
							children: [{ text: 'Second Heading' }]
						}
					]
				}
			};

			const blocksLayout: BlocksLayout = {
				items: ['block-1', 'block-2']
			};

			const entries = extractHeadingsFromBlocks(blocks, blocksLayout);

			expect(entries).toHaveLength(2);
			expect(entries[0]).toEqual({
				level: 2,
				title: 'First Heading',
				id: 'block-1-first-heading',
				children: []
			});
			expect(entries[1]).toEqual({
				level: 3,
				title: 'Second Heading',
				id: 'block-2-second-heading',
				children: []
			});
		});

		test('filters headings by configured levels', () => {
			const blocks: PageBlocks = {
				'block-1': {
					'@type': 'slate',
					value: [
						{ type: 'h2', children: [{ text: 'H2 Heading' }] },
						{ type: 'h3', children: [{ text: 'H3 Heading' }] },
						{ type: 'h4', children: [{ text: 'H4 Heading' }] }
					]
				}
			};

			const blocksLayout: BlocksLayout = { items: ['block-1'] };

			// Only extract h2 and h3
			const entries = extractHeadingsFromBlocks(blocks, blocksLayout, ['h2', 'h3']);

			expect(entries).toHaveLength(2);
			expect(entries[0].title).toBe('H2 Heading');
			expect(entries[1].title).toBe('H3 Heading');
		});

		test('skips empty and whitespace-only headings', () => {
			const blocks: PageBlocks = {
				'block-1': {
					'@type': 'slate',
					value: [
						{ type: 'h2', children: [{ text: 'Valid Heading' }] },
						{ type: 'h3', children: [{ text: '' }] },
						{ type: 'h3', children: [{ text: '   ' }] },
						{ type: 'h4', children: [{ text: 'Another Valid' }] }
					]
				}
			};

			const blocksLayout: BlocksLayout = { items: ['block-1'] };
			const entries = extractHeadingsFromBlocks(blocks, blocksLayout);

			expect(entries).toHaveLength(2);
			expect(entries[0].title).toBe('Valid Heading');
			expect(entries[1].title).toBe('Another Valid');
		});

		test('ignores non-slate blocks', () => {
			const blocks: PageBlocks = {
				'block-1': {
					'@type': 'slate',
					value: [{ type: 'h2', children: [{ text: 'Slate Heading' }] }]
				},
				'block-2': {
					'@type': 'image'
				},
				'block-3': {
					'@type': 'teaser'
				}
			};

			const blocksLayout: BlocksLayout = { items: ['block-1', 'block-2', 'block-3'] };
			const entries = extractHeadingsFromBlocks(blocks, blocksLayout);

			expect(entries).toHaveLength(1);
			expect(entries[0].title).toBe('Slate Heading');
		});

		test('handles empty or missing blocks gracefully', () => {
			expect(extractHeadingsFromBlocks({}, { items: [] })).toEqual([]);
			expect(extractHeadingsFromBlocks({}, { items: ['missing-block'] })).toEqual([]);
			// @ts-expect-error Testing null case
			expect(extractHeadingsFromBlocks(null, null)).toEqual([]);
		});
	});
});
