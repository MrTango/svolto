import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock IntersectionObserver for embla-carousel and other components
class MockIntersectionObserver implements IntersectionObserver {
	readonly root: Element | Document | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray<number> = [];

	constructor(
		private callback: IntersectionObserverCallback,
		_options?: IntersectionObserverInit
	) {}

	observe(_target: Element): void {
		// Immediately trigger callback with entry marked as intersecting
		const entry: IntersectionObserverEntry = {
			boundingClientRect: {} as DOMRectReadOnly,
			intersectionRatio: 1,
			intersectionRect: {} as DOMRectReadOnly,
			isIntersecting: true,
			rootBounds: null,
			target: _target,
			time: Date.now()
		};
		this.callback([entry], this);
	}

	unobserve(_target: Element): void {}

	disconnect(): void {}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	enumerable: true,
	value: MockIntersectionObserver
});

Object.defineProperty(global, 'IntersectionObserver', {
	writable: true,
	enumerable: true,
	value: MockIntersectionObserver
});

// Mock ResizeObserver for embla-carousel and other components
class MockResizeObserver implements ResizeObserver {
	constructor(private callback: ResizeObserverCallback) {}

	observe(_target: Element, _options?: ResizeObserverOptions): void {
		// Trigger callback with a mock entry
		const entry: ResizeObserverEntry = {
			target: _target,
			contentRect: {
				x: 0,
				y: 0,
				width: 800,
				height: 600,
				top: 0,
				right: 800,
				bottom: 600,
				left: 0,
				toJSON: () => ({})
			},
			borderBoxSize: [{ blockSize: 600, inlineSize: 800 }],
			contentBoxSize: [{ blockSize: 600, inlineSize: 800 }],
			devicePixelContentBoxSize: [{ blockSize: 600, inlineSize: 800 }]
		};
		this.callback([entry], this);
	}

	unobserve(_target: Element): void {}

	disconnect(): void {}
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	enumerable: true,
	value: MockResizeObserver
});

Object.defineProperty(global, 'ResizeObserver', {
	writable: true,
	enumerable: true,
	value: MockResizeObserver
});

// add more mocks here if you need them
