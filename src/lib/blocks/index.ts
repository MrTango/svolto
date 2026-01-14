import type { Component } from 'svelte';

// Synchronous imports for common, lightweight blocks
import DescriptionBlockView from './description/DescriptionBlockView.svelte';
import ImageBlockView from './image/ImageBlockView.svelte';
import IntroductionBlockView from './introduction/IntroductionBlockView.svelte';
import SlateBlockView from './slate/SlateBlockView.svelte';
import TeaserBlockView from './teaser/TeaserBlockView.svelte';
import TitleBlockView from './title/TitleBlockView.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SyncBlockView = Component<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncBlockLoader = () => Promise<{ default: Component<any> }>;

type BlockView = SyncBlockView | AsyncBlockLoader;

export interface BlockConfig {
	id: string;
	title: string;
	view: BlockView;
}

export const SYNC_BLOCKS = ['slate', 'title', 'description', 'introduction', 'image', 'teaser'] as const;
export const ASYNC_BLOCKS = ['gridBlock', 'listing', 'video', 'maps', 'slateTable', 'html', 'toc'] as const;

const asyncBlockSet = new Set<string>(ASYNC_BLOCKS);

export function isAsyncBlock(blockType: string): boolean {
	return asyncBlockSet.has(blockType);
}

export const blocksConfig: Record<string, BlockConfig> = {
	// Synchronous blocks (common, lightweight)
	slate: {
		id: 'slate',
		title: 'Slate',
		view: SlateBlockView
	},
	title: {
		id: 'title',
		title: 'Title',
		view: TitleBlockView
	},
	description: {
		id: 'description',
		title: 'Description',
		view: DescriptionBlockView
	},
	introduction: {
		id: 'introduction',
		title: 'Introduction',
		view: IntroductionBlockView
	},
	image: {
		id: 'image',
		title: 'Image',
		view: ImageBlockView
	},
	teaser: {
		id: 'teaser',
		title: 'Teaser',
		view: TeaserBlockView
	},

	// Asynchronous blocks (heavy dependencies, lazy loaded)
	gridBlock: {
		id: 'gridBlock',
		title: 'Grid',
		view: () => import('./grid/GridBlockView.svelte')
	},
	listing: {
		id: 'listing',
		title: 'Listing',
		view: () => import('./listing/ListingBlockView.svelte')
	},
	video: {
		id: 'video',
		title: 'Video',
		view: () => import('./video/VideoBlockView.svelte')
	},
	maps: {
		id: 'maps',
		title: 'Maps',
		view: () => import('./maps/MapsBlockView.svelte')
	},
	slateTable: {
		id: 'slateTable',
		title: 'Slate Table',
		view: () => import('./slateTable/SlateTableBlockView.svelte')
	},
	html: {
		id: 'html',
		title: 'HTML',
		view: () => import('./html/HtmlBlockView.svelte')
	},
	toc: {
		id: 'toc',
		title: 'Table of Contents',
		view: () => import('./toc/TocBlockView.svelte')
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getBlockComponent(blockType: string): Promise<Component<any> | null> {
	if (!blockType) {
		return null;
	}

	const config = blocksConfig[blockType];
	if (!config) {
		return null;
	}

	if (isAsyncBlock(blockType)) {
		try {
			const module = await (config.view as AsyncBlockLoader)();
			return module.default;
		} catch (error) {
			console.error(`Failed to load block "${blockType}":`, error);
			return null;
		}
	}

	return config.view as SyncBlockView;
}

// Default export for backward compatibility
export default blocksConfig;
