import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import SlateBlockView from './SlateBlockView.svelte';

const defaultProps = {
	metadata: {},
	properties: {},
	path: '/',
	blocksConfig: {}
};

describe('Slate Heading ID Generation', () => {
	test('H2 component renders with generated id attribute', () => {
		const data = {
			value: [
				{
					type: 'h2',
					children: [{ text: 'Introduction Section' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'block-123', data }
		});

		const h2 = container.querySelector('h2.slate-h2');
		expect(h2).toBeInTheDocument();
		expect(h2).toHaveAttribute('id');
		// ID should be present and non-empty
		const id = h2?.getAttribute('id');
		expect(id).toBeTruthy();
	});

	test('heading ID is generated from node text content', () => {
		const data = {
			value: [
				{
					type: 'h3',
					children: [{ text: 'Getting Started Guide' }]
				}
			]
		};

		const { container } = render(SlateBlockView, {
			props: { ...defaultProps, key: 'test-key', id: 'my-block', data }
		});

		const h3 = container.querySelector('h3.slate-h3');
		expect(h3).toBeInTheDocument();
		const id = h3?.getAttribute('id');
		// ID should contain the slugified text
		expect(id).toContain('getting-started-guide');
	});

	test('heading ID includes block ID prefix for uniqueness', () => {
		const data = {
			value: [
				{
					type: 'h4',
					children: [{ text: 'My Heading' }]
				}
			]
		};

		const blockId = 'unique-block-456';
		const { container } = render(SlateBlockView, {
			props: { ...defaultProps, key: 'test-key', id: blockId, data }
		});

		const h4 = container.querySelector('h4.slate-h4');
		expect(h4).toBeInTheDocument();
		const id = h4?.getAttribute('id');
		// ID should have format: {blockId}-{slug}
		expect(id).toBe('unique-block-456-my-heading');
	});
});
