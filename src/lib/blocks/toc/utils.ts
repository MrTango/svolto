/**
 * Utility functions for the TOC Block
 *
 * Provides slug generation, anchor ID creation, and heading extraction
 * from slate block data structures.
 */

import type { TocEntry, SlateNode, PageBlocks, BlocksLayout, SlateBlockData } from './types';

/**
 * Generate a URL-safe slug from text content.
 *
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphen-separated slug with special characters removed
 */
export function generateSlug(text: string): string {
	return (
		text
			// Normalize unicode characters (decompose accented characters)
			.normalize('NFD')
			// Remove diacritical marks (accents)
			.replace(/[\u0300-\u036f]/g, '')
			// Convert to lowercase
			.toLowerCase()
			// Replace spaces and underscores with hyphens
			.replace(/[\s_]+/g, '-')
			// Remove non-alphanumeric characters except hyphens
			.replace(/[^a-z0-9-]/g, '')
			// Replace multiple consecutive hyphens with single hyphen
			.replace(/-+/g, '-')
			// Remove leading and trailing hyphens
			.replace(/^-|-$/g, '')
	);
}

/**
 * Generate a unique anchor ID from block ID and text content.
 *
 * @param blockId - The slate block's unique ID
 * @param text - The heading text content
 * @returns A unique anchor ID in format: {blockId}-{slug}
 */
export function generateAnchorId(blockId: string, text: string): string {
	const slug = generateSlug(text);
	if (!slug) {
		return blockId;
	}
	return `${blockId}-${slug}`;
}

/**
 * Extract text content from a slate node recursively.
 *
 * @param node - The slate node to extract text from
 * @returns Concatenated text content from all text nodes
 */
export function extractTextFromSlateNode(node: SlateNode): string {
	// If this is a text node, return its text content
	if (node.text !== undefined) {
		return node.text;
	}

	// If this node has children, recursively extract text from them
	if (node.children && Array.isArray(node.children)) {
		return node.children.map((child) => extractTextFromSlateNode(child)).join('');
	}

	return '';
}

/**
 * Check if a slate node is a heading of the specified levels.
 *
 * @param node - The slate node to check
 * @param levels - Array of heading levels to match (e.g., ['h2', 'h3'])
 * @returns True if the node is a heading matching the specified levels
 */
function isHeadingNode(node: SlateNode, levels: string[]): boolean {
	if (!node.type) {
		return false;
	}
	return levels.includes(node.type);
}

/**
 * Get the numeric level from a heading type string.
 *
 * @param type - The heading type (e.g., 'h2', 'h3')
 * @returns The numeric level (e.g., 2, 3)
 */
function getHeadingLevel(type: string): number {
	const match = type.match(/^h(\d)$/);
	return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract heading nodes from a slate block's value array.
 *
 * @param nodes - Array of slate nodes from block data.value
 * @param levels - Array of heading levels to extract (e.g., ['h2', 'h3'])
 * @param blockId - The block ID for generating anchor IDs
 * @returns Array of heading info objects
 */
function extractHeadingsFromNodes(
	nodes: SlateNode[],
	levels: string[],
	blockId: string
): { level: number; title: string; id: string }[] {
	const headings: { level: number; title: string; id: string }[] = [];

	for (const node of nodes) {
		if (isHeadingNode(node, levels)) {
			const title = extractTextFromSlateNode(node).trim();
			// Skip empty or whitespace-only headings
			if (title) {
				headings.push({
					level: getHeadingLevel(node.type!),
					title,
					id: generateAnchorId(blockId, title)
				});
			}
		}
	}

	return headings;
}

/**
 * Default heading levels to extract if not specified.
 */
const DEFAULT_LEVELS = ['h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Extract headings from all slate blocks on a page.
 *
 * @param blocks - The page blocks object from properties.blocks
 * @param blocksLayout - The blocks layout object from properties.blocks_layout
 * @param levels - Array of heading levels to extract (defaults to h2-h6)
 * @returns Array of TocEntry objects with level, title, id, and empty children array
 */
export function extractHeadingsFromBlocks(
	blocks: PageBlocks,
	blocksLayout: BlocksLayout,
	levels: string[] = DEFAULT_LEVELS
): TocEntry[] {
	const entries: TocEntry[] = [];

	if (!blocks || !blocksLayout?.items) {
		return entries;
	}

	// Iterate blocks in layout order
	for (const blockId of blocksLayout.items) {
		const block = blocks[blockId];

		// Skip if block doesn't exist
		if (!block) {
			continue;
		}

		// Check if this is a slate block
		const blockData = block as SlateBlockData;
		if (blockData['@type'] !== 'slate') {
			continue;
		}

		// Extract headings from the slate block's value
		if (blockData.value && Array.isArray(blockData.value)) {
			const headings = extractHeadingsFromNodes(blockData.value, levels, blockId);
			for (const heading of headings) {
				entries.push({
					level: heading.level,
					title: heading.title,
					id: heading.id,
					children: []
				});
			}
		}
	}

	return entries;
}
