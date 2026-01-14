import { describe, test, expect } from 'vitest';
import {
	blocksConfig,
	isAsyncBlock,
	getBlockComponent,
	SYNC_BLOCKS,
	ASYNC_BLOCKS
} from './index';

import SlateBlockView from './slate/SlateBlockView.svelte';
import TitleBlockView from './title/TitleBlockView.svelte';
import DescriptionBlockView from './description/DescriptionBlockView.svelte';
import IntroductionBlockView from './introduction/IntroductionBlockView.svelte';
import ImageBlockView from './image/ImageBlockView.svelte';
import TeaserBlockView from './teaser/TeaserBlockView.svelte';

/**
 * Task Group 4.1: Block Loading Tests
 *
 * These tests verify the hybrid loading behavior of the block registry:
 * - Common blocks (slate, title, description, introduction, image, teaser) load synchronously
 * - Heavy blocks (gridBlock, listing, video, maps, slateTable, html, toc) load dynamically
 * - getBlockComponent handles both sync and async blocks correctly
 */
describe('Block Registry - Hybrid Loading', () => {
	describe('Synchronous blocks (common, lightweight)', () => {
		test('slate block is registered as synchronous component', () => {
			expect(blocksConfig.slate).toBeDefined();
			expect(blocksConfig.slate.id).toBe('slate');
			expect(blocksConfig.slate.view).toBe(SlateBlockView);
			expect(isAsyncBlock('slate')).toBe(false);
		});

		test('title block is registered as synchronous component', () => {
			expect(blocksConfig.title).toBeDefined();
			expect(blocksConfig.title.id).toBe('title');
			expect(blocksConfig.title.view).toBe(TitleBlockView);
			expect(isAsyncBlock('title')).toBe(false);
		});

		test('description block is registered as synchronous component', () => {
			expect(blocksConfig.description).toBeDefined();
			expect(blocksConfig.description.id).toBe('description');
			expect(blocksConfig.description.view).toBe(DescriptionBlockView);
			expect(isAsyncBlock('description')).toBe(false);
		});

		test('introduction block is registered as synchronous component', () => {
			expect(blocksConfig.introduction).toBeDefined();
			expect(blocksConfig.introduction.id).toBe('introduction');
			expect(blocksConfig.introduction.view).toBe(IntroductionBlockView);
			expect(isAsyncBlock('introduction')).toBe(false);
		});

		test('image block is registered as synchronous component', () => {
			expect(blocksConfig.image).toBeDefined();
			expect(blocksConfig.image.id).toBe('image');
			expect(blocksConfig.image.view).toBe(ImageBlockView);
			expect(isAsyncBlock('image')).toBe(false);
		});

		test('teaser block is registered as synchronous component', () => {
			expect(blocksConfig.teaser).toBeDefined();
			expect(blocksConfig.teaser.id).toBe('teaser');
			expect(blocksConfig.teaser.view).toBe(TeaserBlockView);
			expect(isAsyncBlock('teaser')).toBe(false);
		});

		test('SYNC_BLOCKS list contains all common blocks', () => {
			expect(SYNC_BLOCKS).toContain('slate');
			expect(SYNC_BLOCKS).toContain('title');
			expect(SYNC_BLOCKS).toContain('description');
			expect(SYNC_BLOCKS).toContain('introduction');
			expect(SYNC_BLOCKS).toContain('image');
			expect(SYNC_BLOCKS).toContain('teaser');
		});
	});

	describe('Asynchronous blocks (heavy dependencies)', () => {
		test('gridBlock is registered as async loader function', () => {
			expect(blocksConfig.gridBlock).toBeDefined();
			expect(blocksConfig.gridBlock.id).toBe('gridBlock');
			expect(typeof blocksConfig.gridBlock.view).toBe('function');
			expect(isAsyncBlock('gridBlock')).toBe(true);
		});

		test('listing is registered as async loader function', () => {
			expect(blocksConfig.listing).toBeDefined();
			expect(blocksConfig.listing.id).toBe('listing');
			expect(typeof blocksConfig.listing.view).toBe('function');
			expect(isAsyncBlock('listing')).toBe(true);
		});

		test('video is registered as async loader function', () => {
			expect(blocksConfig.video).toBeDefined();
			expect(blocksConfig.video.id).toBe('video');
			expect(typeof blocksConfig.video.view).toBe('function');
			expect(isAsyncBlock('video')).toBe(true);
		});

		test('maps is registered as async loader function', () => {
			expect(blocksConfig.maps).toBeDefined();
			expect(blocksConfig.maps.id).toBe('maps');
			expect(typeof blocksConfig.maps.view).toBe('function');
			expect(isAsyncBlock('maps')).toBe(true);
		});

		test('slateTable is registered as async loader function', () => {
			expect(blocksConfig.slateTable).toBeDefined();
			expect(blocksConfig.slateTable.id).toBe('slateTable');
			expect(typeof blocksConfig.slateTable.view).toBe('function');
			expect(isAsyncBlock('slateTable')).toBe(true);
		});

		test('html is registered as async loader function', () => {
			expect(blocksConfig.html).toBeDefined();
			expect(blocksConfig.html.id).toBe('html');
			expect(typeof blocksConfig.html.view).toBe('function');
			expect(isAsyncBlock('html')).toBe(true);
		});

		test('toc is registered as async loader function', () => {
			expect(blocksConfig.toc).toBeDefined();
			expect(blocksConfig.toc.id).toBe('toc');
			expect(typeof blocksConfig.toc.view).toBe('function');
			expect(isAsyncBlock('toc')).toBe(true);
		});

		test('ASYNC_BLOCKS list contains all heavy blocks', () => {
			expect(ASYNC_BLOCKS).toContain('gridBlock');
			expect(ASYNC_BLOCKS).toContain('listing');
			expect(ASYNC_BLOCKS).toContain('video');
			expect(ASYNC_BLOCKS).toContain('maps');
			expect(ASYNC_BLOCKS).toContain('slateTable');
			expect(ASYNC_BLOCKS).toContain('html');
			expect(ASYNC_BLOCKS).toContain('toc');
		});
	});

	describe('getBlockComponent function', () => {
		test('returns sync block components directly', async () => {
			const slateComponent = await getBlockComponent('slate');
			expect(slateComponent).toBe(SlateBlockView);

			const titleComponent = await getBlockComponent('title');
			expect(titleComponent).toBe(TitleBlockView);

			const descriptionComponent = await getBlockComponent('description');
			expect(descriptionComponent).toBe(DescriptionBlockView);
		});

		test('loads async block components dynamically', async () => {
			const gridComponent = await getBlockComponent('gridBlock');
			expect(gridComponent).toBeDefined();
			expect(typeof gridComponent).toBe('function');

			const listingComponent = await getBlockComponent('listing');
			expect(listingComponent).toBeDefined();
			expect(typeof listingComponent).toBe('function');
		});

		test('returns null for unknown block types', async () => {
			const result = await getBlockComponent('unknownBlockType');
			expect(result).toBeNull();
		});

		test('returns null for undefined input', async () => {
			const result = await getBlockComponent(undefined as unknown as string);
			expect(result).toBeNull();
		});
	});
});
