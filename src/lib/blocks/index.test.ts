import { describe, test, expect } from 'vitest';
import { blocksConfig, getBlockComponent, isAsyncBlock } from './index';

describe('Block Registry - Maps Block', () => {
	test('maps block is registered and exports correctly', async () => {
		expect(blocksConfig.maps).toBeDefined();
		expect(blocksConfig.maps.id).toBe('maps');
		expect(blocksConfig.maps.title).toBe('Maps');
		expect(isAsyncBlock('maps')).toBe(true);
		// Verify async loading works
		const component = await getBlockComponent('maps');
		expect(component).toBeDefined();
		expect(typeof component).toBe('function');
	});
});

describe('Block Registry - HTML Block', () => {
	test('html block is registered in blocks object', () => {
		expect(blocksConfig.html).toBeDefined();
	});

	test('html block has correct id, title, and view component', async () => {
		expect(blocksConfig.html.id).toBe('html');
		expect(blocksConfig.html.title).toBe('HTML');
		expect(isAsyncBlock('html')).toBe(true);
		// Verify async loading works
		const component = await getBlockComponent('html');
		expect(component).toBeDefined();
		expect(typeof component).toBe('function');
	});
});

describe('Block Registry - TOC Block', () => {
	test('TOC block is registered in blocksConfig', async () => {
		expect(blocksConfig.toc).toBeDefined();
		expect(blocksConfig.toc.id).toBe('toc');
		expect(blocksConfig.toc.title).toBe('Table of Contents');
		expect(isAsyncBlock('toc')).toBe(true);
		// Verify async loading works
		const component = await getBlockComponent('toc');
		expect(component).toBeDefined();
		expect(typeof component).toBe('function');
	});
});
