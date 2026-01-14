/**
 * TypeScript interfaces for the TOC Block
 *
 * These types define the structure for table of contents entries
 * and block configuration data.
 */

/**
 * A single entry in the table of contents
 */
export interface TocEntry {
	/** Heading level (2-6 for h2-h6) */
	level: number;
	/** The heading text content */
	title: string;
	/** Unique anchor ID for navigation */
	id: string;
	/** Nested child entries (for hierarchical display) */
	children: TocEntry[];
}

/**
 * TOC block configuration data from Plone
 */
export interface TocBlockData {
	/** Block type identifier */
	'@type'?: string;
	/** Optional title displayed above the TOC */
	title?: string;
	/** Whether to hide the title even if provided */
	hide_title?: boolean;
	/** Which heading levels to include (e.g., ['h2', 'h3']) */
	levels?: string[];
	/** Use numbered list vs bullet list (default variation only) */
	ordered?: boolean;
	/** Enable sticky positioning (horizontal variation only) */
	sticky?: boolean;
	/** Variation template to use ('default' or 'horizontalMenu') */
	variation?: string;
}

/**
 * Props for TOC variation components
 */
export interface TocVariationProps {
	/** Array of TOC entries to display */
	entries: TocEntry[];
	/** Use numbered list vs bullet list */
	ordered?: boolean;
	/** Enable sticky positioning (horizontal variation only) */
	sticky?: boolean;
}

/**
 * Slate node structure for heading extraction
 */
export interface SlateNode {
	/** Node type (e.g., 'h2', 'h3', 'p', 'text') */
	type?: string;
	/** Text content for text nodes */
	text?: string;
	/** Child nodes */
	children?: SlateNode[];
}

/**
 * Slate block data structure
 */
export interface SlateBlockData {
	/** Block type identifier */
	'@type'?: string;
	/** Slate editor value (array of nodes) */
	value?: SlateNode[];
}

/**
 * Page blocks structure from properties
 */
export interface PageBlocks {
	[blockId: string]: SlateBlockData | Record<string, unknown>;
}

/**
 * Blocks layout structure
 */
export interface BlocksLayout {
	items: string[];
}
