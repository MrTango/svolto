import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import RenderBlocks from './RenderBlocks.svelte';
import blocks from '$lib/blocks';

describe('RenderBlocks', () => {
	test('renders DescriptionBlockView via RenderBlocks', () => {
		const content = {
			blocks_layout: {
				items: ['block-1']
			},
			blocks: {
				'block-1': {
					'@type': 'description'
				}
			},
			description: 'Test description via RenderBlocks'
		};

		render(RenderBlocks, {
			props: {
				content,
				blocksConfig: blocks,
				pathname: '/test-path'
			}
		});

		expect(screen.getByText('Test description via RenderBlocks')).toBeInTheDocument();
	});

	test('passes metadata prop to block components', () => {
		const metadata = {
			description: 'Metadata description'
		};
		const content = {
			blocks_layout: {
				items: ['block-1']
			},
			blocks: {
				'block-1': {
					'@type': 'description'
				}
			},
			description: 'Properties description'
		};

		render(RenderBlocks, {
			props: {
				content,
				blocksConfig: blocks,
				pathname: '/test-path',
				metadata
			}
		});

		expect(screen.getByText('Metadata description')).toBeInTheDocument();
	});

	test('passes path prop to block components', () => {
		const content = {
			blocks_layout: {
				items: ['block-1']
			},
			blocks: {
				'block-1': {
					'@type': 'title'
				}
			},
			title: 'Test Title'
		};

		const { container } = render(RenderBlocks, {
			props: {
				content,
				blocksConfig: blocks,
				pathname: '/custom-path'
			}
		});

		expect(container.querySelector('.VoltoBlock')).toBeInTheDocument();
	});
});
