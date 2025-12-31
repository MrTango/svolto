import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import GridBlockView from './GridBlockView.svelte';
import blocks from '$lib/blocks/index';

describe('GridBlockView - Component Foundation', () => {
	test('renders grid with valid blocks_layout structure', () => {
		const data = {
			blocks: {
				'col-1': {
					blocks: {},
					blocks_layout: { items: [] }
				},
				'col-2': {
					blocks: {},
					blocks_layout: { items: [] }
				}
			},
			blocks_layout: {
				items: ['col-1', 'col-2']
			}
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toBeInTheDocument();
	});

	test('returns empty when blocks_layout is undefined', () => {
		const data = {
			blocks: {
				'col-1': {
					blocks: {},
					blocks_layout: { items: [] }
				}
			}
			// blocks_layout is undefined
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).not.toBeInTheDocument();
	});

	test('renders headline as h2 when data.headline is truthy', () => {
		const data = {
			headline: 'Grid Section Title',
			blocks: {
				'col-1': {
					blocks: {},
					blocks_layout: { items: [] }
				}
			},
			blocks_layout: {
				items: ['col-1']
			}
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const headline = container.querySelector('h2.headline');
		expect(headline).toBeInTheDocument();
		expect(headline).toHaveTextContent('Grid Section Title');
	});

	test('does not render headline when data.headline is falsy', () => {
		const data = {
			headline: '',
			blocks: {
				'col-1': {
					blocks: {},
					blocks_layout: { items: [] }
				}
			},
			blocks_layout: {
				items: ['col-1']
			}
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const headline = container.querySelector('h2.headline');
		expect(headline).not.toBeInTheDocument();
	});

	test('applies correct column count class for two columns', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: {
				items: ['col-1', 'col-2']
			}
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toHaveClass('two');
	});

	test('applies correct column count class for one, three, and four columns', () => {
		// Test one column
		const oneColData = {
			blocks: { 'col-1': { blocks: {}, blocks_layout: { items: [] } } },
			blocks_layout: { items: ['col-1'] }
		};
		const { container: container1 } = render(GridBlockView, {
			props: { key: 'test-1', id: 'test-1', data: oneColData }
		});
		expect(container1.querySelector('.block.grid')).toHaveClass('one');

		// Test three columns
		const threeColData = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3'] }
		};
		const { container: container3 } = render(GridBlockView, {
			props: { key: 'test-3', id: 'test-3', data: threeColData }
		});
		expect(container3.querySelector('.block.grid')).toHaveClass('three');

		// Test four columns
		const fourColData = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } },
				'col-4': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3', 'col-4'] }
		};
		const { container: container4 } = render(GridBlockView, {
			props: { key: 'test-4', id: 'test-4', data: fourColData }
		});
		expect(container4.querySelector('.block.grid')).toHaveClass('four');
	});

	test('renders column wrappers for each column in blocks_layout', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: {
				items: ['col-1', 'col-2', 'col-3']
			}
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const columns = container.querySelectorAll('.grid-column');
		expect(columns).toHaveLength(3);
	});
});

describe('GridBlockView - Grid Layout and Nested Blocks', () => {
	test('1-column grid applies class "one"', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toHaveClass('one');
		expect(gridBlock).not.toHaveClass('two');
		expect(gridBlock).not.toHaveClass('three');
		expect(gridBlock).not.toHaveClass('four');
	});

	test('2-column grid applies class "two"', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toHaveClass('two');
		expect(gridBlock).not.toHaveClass('one');
		expect(gridBlock).not.toHaveClass('three');
		expect(gridBlock).not.toHaveClass('four');
	});

	test('3-column grid applies class "three"', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toHaveClass('three');
		expect(gridBlock).not.toHaveClass('one');
		expect(gridBlock).not.toHaveClass('two');
		expect(gridBlock).not.toHaveClass('four');
	});

	test('4-column grid applies class "four"', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } },
				'col-4': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3', 'col-4'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toHaveClass('four');
		expect(gridBlock).not.toHaveClass('one');
		expect(gridBlock).not.toHaveClass('two');
		expect(gridBlock).not.toHaveClass('three');
	});

	test('RenderBlocks receives correct props for each column', () => {
		// Create data with nested slate blocks in each column
		const data = {
			blocks: {
				'col-1': {
					blocks: {
						'slate-1': {
							'@type': 'slate',
							value: [{ type: 'p', children: [{ text: 'Column 1 content' }] }]
						}
					},
					blocks_layout: { items: ['slate-1'] }
				},
				'col-2': {
					blocks: {
						'slate-2': {
							'@type': 'slate',
							value: [{ type: 'p', children: [{ text: 'Column 2 content' }] }]
						}
					},
					blocks_layout: { items: ['slate-2'] }
				}
			},
			blocks_layout: { items: ['col-1', 'col-2'] }
		};

		const { container } = render(GridBlockView, {
			props: {
				key: 'test-key',
				id: 'test-id',
				data,
				blocksConfig: blocks,
				path: '/test-path',
				metadata: { title: 'Test Page' }
			}
		});

		// Verify that the grid renders with two columns
		const columns = container.querySelectorAll('.grid-column');
		expect(columns).toHaveLength(2);

		// Verify that RenderBlocks components are rendered inside each column
		// Each column should contain a VoltoBlock div (from RenderBlocks)
		const voltoBlocks = container.querySelectorAll('.VoltoBlock');
		expect(voltoBlocks.length).toBeGreaterThanOrEqual(2);
	});

	test('nested blocksConfig excludes gridBlock to prevent nested grids', () => {
		// Create a mock blocksConfig that includes gridBlock
		const mockBlocksConfigWithGrid = {
			...blocks,
			gridBlock: {
				id: 'gridBlock',
				title: 'Grid',
				view: GridBlockView
			}
		};

		// This test verifies that gridBlock is not available in nested contexts
		// by checking that a nested gridBlock would render as DefaultBlockView (not as grid)
		const data = {
			blocks: {
				'col-1': {
					blocks: {
						'nested-grid': {
							'@type': 'gridBlock', // This should not render as a grid
							blocks: {
								'inner-col-1': { blocks: {}, blocks_layout: { items: [] } }
							},
							blocks_layout: { items: ['inner-col-1'] }
						}
					},
					blocks_layout: { items: ['nested-grid'] }
				}
			},
			blocks_layout: { items: ['col-1'] }
		};

		const { container } = render(GridBlockView, {
			props: {
				key: 'test-key',
				id: 'test-id',
				data,
				blocksConfig: mockBlocksConfigWithGrid,
				path: '/test-path'
			}
		});

		// The outer grid should exist
		const outerGrid = container.querySelector('.block.grid');
		expect(outerGrid).toBeInTheDocument();

		// There should not be a nested grid inside the column
		// (only one .block.grid element should exist - the outer one)
		// because gridBlock is filtered out from nested blocksConfig
		const allGrids = container.querySelectorAll('.block.grid');
		expect(allGrids).toHaveLength(1);
	});
});

describe('GridBlockView - Flexbox CSS and Responsive Layout', () => {
	test('grid container has correct flexbox properties applied via CSS classes', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toBeInTheDocument();
		// Verify the grid container has the expected CSS classes for flexbox styling
		expect(gridBlock).toHaveClass('block');
		expect(gridBlock).toHaveClass('grid');
	});

	test('columns have grid-column class for min-width constraint styling', () => {
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const columns = container.querySelectorAll('.grid-column');
		expect(columns).toHaveLength(3);

		// Verify each column has the grid-column class for min-width styling
		columns.forEach((column) => {
			expect(column).toHaveClass('grid-column');
		});
	});

	test('column count classes enable flex-basis calculations for equal-width columns', () => {
		// Test that each column count variation has the correct CSS class
		// which enables the flex-basis calculation in CSS

		// 2 columns - each should be ~50% width
		const twoColData = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2'] }
		};
		const { container: container2 } = render(GridBlockView, {
			props: { key: 'test-2', id: 'test-2', data: twoColData }
		});
		expect(container2.querySelector('.block.grid.two')).toBeInTheDocument();

		// 4 columns - each should be ~25% width
		const fourColData = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } },
				'col-4': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3', 'col-4'] }
		};
		const { container: container4 } = render(GridBlockView, {
			props: { key: 'test-4', id: 'test-4', data: fourColData }
		});
		expect(container4.querySelector('.block.grid.four')).toBeInTheDocument();
	});

	test('grid structure supports flex-wrap for natural column wrapping', () => {
		// Verify the DOM structure supports flex-wrap behavior:
		// - Container with .block.grid class (where display:flex and flex-wrap:wrap are applied)
		// - Direct children are .grid-column elements (flex items)
		const data = {
			blocks: {
				'col-1': { blocks: {}, blocks_layout: { items: [] } },
				'col-2': { blocks: {}, blocks_layout: { items: [] } },
				'col-3': { blocks: {}, blocks_layout: { items: [] } },
				'col-4': { blocks: {}, blocks_layout: { items: [] } }
			},
			blocks_layout: { items: ['col-1', 'col-2', 'col-3', 'col-4'] }
		};

		const { container } = render(GridBlockView, {
			props: { key: 'test-key', id: 'test-id', data }
		});

		const gridBlock = container.querySelector('.block.grid');
		expect(gridBlock).toBeInTheDocument();

		// Verify columns are direct children of the grid container
		const columns = gridBlock?.querySelectorAll(':scope > .grid-column');
		expect(columns).toHaveLength(4);

		// Each column should be a direct child for flex-wrap to work correctly
		columns?.forEach((column) => {
			expect(column.parentElement).toBe(gridBlock);
		});
	});
});

describe('GridBlockView - Nested Listing Blocks', () => {
	test('listing blocks render within grid columns', () => {
		// Create data with a listing block in a grid column
		const data = {
			blocks: {
				'col-1': {
					'@type': 'listing',
					querystring: {
						query: [{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: ['Document'] }]
					}
				},
				'col-2': {
					'@type': 'slate',
					value: [{ type: 'p', children: [{ text: 'Column 2 content' }] }]
				}
			},
			blocks_layout: { items: ['col-1', 'col-2'] }
		};

		const { container } = render(GridBlockView, {
			props: {
				key: 'test-key',
				id: 'test-id',
				data,
				blocksConfig: blocks,
				path: '/test-path'
			}
		});

		// Verify grid renders with two columns
		const columns = container.querySelectorAll('.grid-column');
		expect(columns).toHaveLength(2);

		// Verify that a VoltoBlock wrapper exists for each column
		const voltoBlocks = container.querySelectorAll('.VoltoBlock');
		expect(voltoBlocks).toHaveLength(2);

		// Verify listing block renders (it should show loading state or content)
		// The listing block is recognized and rendered (not fallback to DefaultBlockView)
		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).toBeInTheDocument();
	});

	test('listing component receives correct props from grid', () => {
		// Create mock listing data to pass through
		const listingData = {
			'listing-1': {
				items: [
					{ '@id': 'http://example.com/doc1', '@type': 'Document', title: 'Test Doc 1' }
				],
				total: 1
			}
		};

		const data = {
			blocks: {
				'listing-1': {
					'@type': 'listing',
					querystring: {
						query: [{ i: 'portal_type', o: 'plone.app.querystring.operation.selection.any', v: ['Document'] }]
					}
				}
			},
			blocks_layout: { items: ['listing-1'] }
		};

		const { container } = render(GridBlockView, {
			props: {
				key: 'test-key',
				id: 'test-id',
				data,
				blocksConfig: blocks,
				path: '/test-path',
				listingData,
				currentPage: 1,
				paginatedBlockCount: 1
			}
		});

		// Verify grid renders with one column
		const columns = container.querySelectorAll('.grid-column');
		expect(columns).toHaveLength(1);

		// Verify the listing block is rendered (it receives initialListingData)
		const listingBlock = container.querySelector('.block.listing');
		expect(listingBlock).toBeInTheDocument();

		// Verify the listing is NOT in loading state (since initialListingData was provided)
		// The listing should render items or empty state, not loading spinner
		const loadingSpinner = container.querySelector('.listing-loading');
		expect(loadingSpinner).not.toBeInTheDocument();
	});
});
