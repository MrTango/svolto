import { describe, test, expect } from 'vitest';
import { fullWidth, halfWidth, cardGrid, thumbnail } from './image-sizes';

describe('image-sizes utility', () => {
	test('fullWidth() returns 100vw', () => {
		expect(fullWidth()).toBe('100vw');
	});

	test('halfWidth() returns correct media query string', () => {
		expect(halfWidth()).toBe('(max-width: 768px) 100vw, 50vw');
	});

	test('cardGrid() returns correct responsive breakpoints', () => {
		expect(cardGrid()).toBe('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');
	});

	test('thumbnail(width) returns pixel width string', () => {
		expect(thumbnail(200)).toBe('200px');
		expect(thumbnail(100)).toBe('100px');
		expect(thumbnail(320)).toBe('320px');
	});
});
