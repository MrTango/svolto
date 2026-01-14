/**
 * Image sizes utility functions for responsive image sizing.
 *
 * These functions return standard `sizes` attribute values for common layout patterns.
 * Named exports enable tree-shaking for optimal bundle size.
 */

/**
 * Returns `100vw` for full viewport width images.
 * Use for hero images, full-bleed galleries, and images that span the entire viewport.
 */
export function fullWidth(): string {
	return '100vw';
}

/**
 * Returns a responsive sizes string for half-width images.
 * Mobile-first: full width on small screens (<=768px), half on larger screens.
 */
export function halfWidth(): string {
	return '(max-width: 768px) 100vw, 50vw';
}

/**
 * Returns a responsive sizes string for card grid layouts.
 * Matches the SummaryVariation pattern:
 * - Mobile (<=640px): 1 column, 100vw
 * - Tablet (<=1024px): 2 columns, 50vw
 * - Desktop: 3 columns, 33vw
 */
export function cardGrid(): string {
	return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Returns a fixed pixel width string for thumbnail images.
 * Use for small, fixed-size images where responsive sizing is not needed.
 *
 * @param width - The thumbnail width in pixels (must be positive)
 * @returns The pixel width string (e.g., '200px')
 * @throws Error if width is not a positive number
 */
export function thumbnail(width: number): string {
	if (typeof width !== 'number' || width <= 0 || !isFinite(width)) {
		throw new Error('thumbnail() requires a positive number');
	}
	return `${width}px`;
}
