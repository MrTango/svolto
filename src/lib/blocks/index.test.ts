import { describe, test, expect } from 'vitest';
import blocks from './index';
import HtmlBlockView from './html/HtmlBlockView.svelte';
import MapsBlockView from './maps/MapsBlockView.svelte';
import TocBlockView from './toc/TocBlockView.svelte';

describe('Block Registry - Maps Block', () => {
	test('maps block is registered and exports correctly', () => {
		expect(blocks.maps).toBeDefined();
		expect(blocks.maps.id).toBe('maps');
		expect(blocks.maps.title).toBe('Maps');
		expect(blocks.maps.view).toBe(MapsBlockView);
	});
});

describe('Block Registry - HTML Block', () => {
	test('html block is registered in blocks object', () => {
		expect(blocks.html).toBeDefined();
	});

	test('html block has correct id, title, and view component', () => {
		expect(blocks.html.id).toBe('html');
		expect(blocks.html.title).toBe('HTML');
		expect(blocks.html.view).toBe(HtmlBlockView);
	});
});

describe('Block Registry - TOC Block', () => {
	test('TOC block is registered in blocksConfig', () => {
		expect(blocks.toc).toBeDefined();
		expect(blocks.toc.id).toBe('toc');
		expect(blocks.toc.title).toBe('Table of Contents');
		expect(blocks.toc.view).toBe(TocBlockView);
	});
});
