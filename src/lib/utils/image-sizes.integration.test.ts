import { describe, test, expect } from 'vitest';
import { fullWidth, halfWidth, cardGrid, thumbnail } from './image-sizes';

describe('Image Sizes Utility - Integration and Edge Cases', () => {
	test('thumbnail() throws error for non-positive numbers', () => {
		expect(() => thumbnail(0)).toThrow('thumbnail() requires a positive number');
		expect(() => thumbnail(-100)).toThrow('thumbnail() requires a positive number');
		expect(() => thumbnail(NaN)).toThrow('thumbnail() requires a positive number');
		expect(() => thumbnail(Infinity)).toThrow('thumbnail() requires a positive number');
	});

	test('cardGrid() matches SummaryVariation sizes attribute pattern', () => {
		const expectedSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
		expect(cardGrid()).toBe(expectedSizes);
	});

	test('all size functions return non-empty strings', () => {
		expect(fullWidth().length).toBeGreaterThan(0);
		expect(halfWidth().length).toBeGreaterThan(0);
		expect(cardGrid().length).toBeGreaterThan(0);
		expect(thumbnail(100).length).toBeGreaterThan(0);
	});
});
