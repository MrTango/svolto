import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import SlateTableBlockView from './SlateTableBlockView.svelte';
import RenderBlocks from '$lib/RenderBlocks.svelte';
import blocks from '$lib/blocks';
import { extractPlainText } from './SlateTableBlockView.svelte';

describe('Slate Table Block - Core Component', () => {
	test('renders table with header row and data rows', () => {
		const data = {
			table: {
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Age' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: '30' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Check semantic table structure
		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();

		const thead = container.querySelector('thead');
		expect(thead).toBeInTheDocument();

		const tbody = container.querySelector('tbody');
		expect(tbody).toBeInTheDocument();

		// Check header cells
		const thElements = container.querySelectorAll('th');
		expect(thElements.length).toBe(2);
		expect(thElements[0]).toHaveAttribute('scope', 'col');
		expect(thElements[0]).toHaveTextContent('Name');
		expect(thElements[1]).toHaveTextContent('Age');

		// Check data cells
		const tdElements = container.querySelectorAll('td');
		expect(tdElements.length).toBe(2);
		expect(tdElements[0]).toHaveTextContent('Alice');
		expect(tdElements[1]).toHaveTextContent('30');
	});

	test('handles empty table data gracefully with no rendering', () => {
		const data = {
			table: {
				rows: []
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Should render the block wrapper but no table structure
		const blockDiv = container.querySelector('.block.slateTable');
		expect(blockDiv).toBeInTheDocument();

		const table = container.querySelector('table');
		expect(table).not.toBeInTheDocument();
	});

	test('renders cell content via Slate Leaf component with formatted text', () => {
		const data = {
			table: {
				rows: [
					{
						key: 'row-1',
						cells: [
							{
								key: 'cell-1-1',
								type: 'header',
								value: [
									{
										type: 'p',
										children: [
											{ text: 'Bold ' },
											{ type: 'strong', children: [{ text: 'header' }] }
										]
									}
								]
							}
						]
					},
					{
						key: 'row-2',
						cells: [
							{
								key: 'cell-2-1',
								type: 'data',
								value: [
									{
										type: 'p',
										children: [
											{ type: 'em', children: [{ text: 'italic' }] },
											{ text: ' content' }
										]
									}
								]
							}
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Check that Slate formatting is rendered
		const strong = container.querySelector('strong');
		expect(strong).toBeInTheDocument();
		expect(strong).toHaveTextContent('header');

		const em = container.querySelector('em');
		expect(em).toBeInTheDocument();
		expect(em).toHaveTextContent('italic');
	});

	test('renders empty cells with non-breaking space', () => {
		const data = {
			table: {
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Header' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const td = container.querySelector('td');
		expect(td).toBeInTheDocument();
		// Non-breaking space character
		expect(td?.textContent).toBe('\u00A0');
	});

	test('block is registered and renders when @type is slateTable', () => {
		const content = {
			blocks_layout: {
				items: ['block-1']
			},
			blocks: {
				'block-1': {
					'@type': 'slateTable',
					table: {
						rows: [
							{
								key: 'row-1',
								cells: [
									{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Test Header' }] }] }
								]
							}
						]
					}
				}
			}
		};

		const { container } = render(RenderBlocks, {
			props: {
				content,
				blocksConfig: blocks,
				pathname: '/test-path'
			}
		});

		// Verify table block is rendered via RenderBlocks
		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();
		expect(screen.getByText('Test Header')).toBeInTheDocument();
	});
});

describe('Slate Table Block - Display Options', () => {
	// Helper function to create table data with options
	function createTableData(options: Record<string, boolean> = {}) {
		return {
			table: {
				...options,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Age' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: '30' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Bob' }] }] },
							{ key: 'cell-3-2', type: 'data', value: [{ type: 'p', children: [{ text: '25' }] }] }
						]
					}
				]
			}
		};
	}

	test('hideHeaders conditionally renders thead', () => {
		// Test with hideHeaders = false (default)
		const dataWithHeaders = createTableData({ hideHeaders: false });
		const { container: container1 } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data: dataWithHeaders, properties: {}, path: '/test', metadata: undefined }
		});

		expect(container1.querySelector('thead')).toBeInTheDocument();
		expect(container1.querySelector('th')).toBeInTheDocument();

		// Test with hideHeaders = true
		const dataWithHiddenHeaders = createTableData({ hideHeaders: true });
		const { container: container2 } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data: dataWithHiddenHeaders, properties: {}, path: '/test', metadata: undefined }
		});

		expect(container2.querySelector('thead')).not.toBeInTheDocument();
		expect(container2.querySelector('th')).not.toBeInTheDocument();

		// Verify first row is still excluded from tbody (only 2 data rows shown)
		const tbodyRows = container2.querySelectorAll('tbody tr');
		expect(tbodyRows.length).toBe(2);
	});

	test('applies CSS modifier classes based on options', () => {
		const data = createTableData({
			sortable: true,
			compact: true,
			striped: true
		});

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();
		expect(table).toHaveClass('slateTable--sortable');
		expect(table).toHaveClass('slateTable--compact');
		expect(table).toHaveClass('slateTable--striped');
		expect(table).not.toHaveClass('slateTable--fixed');
		expect(table).not.toHaveClass('slateTable--inverted');
	});

	test('fixed option applies table-layout: fixed via CSS class', () => {
		const data = createTableData({ fixed: true });

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();
		expect(table).toHaveClass('slateTable--fixed');
	});

	test('applies multiple display options in combination', () => {
		const data = createTableData({
			hideHeaders: true,
			fixed: true,
			celled: true,
			inverted: true,
			basic: true,
			striped: true,
			compact: true,
			sortable: true
		});

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();

		// All 8 modifier classes should be present
		expect(table).toHaveClass('slateTable--hide-headers');
		expect(table).toHaveClass('slateTable--fixed');
		expect(table).toHaveClass('slateTable--celled');
		expect(table).toHaveClass('slateTable--inverted');
		expect(table).toHaveClass('slateTable--basic');
		expect(table).toHaveClass('slateTable--striped');
		expect(table).toHaveClass('slateTable--compact');
		expect(table).toHaveClass('slateTable--sortable');

		// Headers should be hidden
		expect(container.querySelector('thead')).not.toBeInTheDocument();
	});
});

describe('Slate Table Block - Sorting Functionality', () => {
	// Helper to create sortable table data
	function createSortableTableData() {
		return {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'City' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Charlie' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: 'Berlin' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-3-2', type: 'data', value: [{ type: 'p', children: [{ text: 'Munich' }] }] }
						]
					},
					{
						key: 'row-4',
						cells: [
							{ key: 'cell-4-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Bob' }] }] },
							{ key: 'cell-4-2', type: 'data', value: [{ type: 'p', children: [{ text: 'Hamburg' }] }] }
						]
					}
				]
			}
		};
	}

	test('sort state management - clicking header sets column and direction', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCells = container.querySelectorAll('th');
		expect(headerCells.length).toBe(2);

		// Initial state: no sorting
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'none');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'none');

		// Click first header
		await fireEvent.click(headerCells[0]);

		// Should now be sorted ascending
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'ascending');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'none');
	});

	test('sort direction toggle cycle: none -> ascending -> descending -> ascending', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');
		expect(headerCell).toBeInTheDocument();

		// Initial state: none
		expect(headerCell).toHaveAttribute('aria-sort', 'none');

		// First click: ascending
		await fireEvent.click(headerCell!);
		expect(headerCell).toHaveAttribute('aria-sort', 'ascending');

		// Second click: descending
		await fireEvent.click(headerCell!);
		expect(headerCell).toHaveAttribute('aria-sort', 'descending');

		// Third click: back to ascending
		await fireEvent.click(headerCell!);
		expect(headerCell).toHaveAttribute('aria-sort', 'ascending');
	});

	test('plain text extraction from Slate nodes', () => {
		// Test simple text
		const simpleNodes = [{ type: 'p', children: [{ text: 'Hello World' }] }];
		expect(extractPlainText(simpleNodes)).toBe('Hello World');

		// Test nested formatting
		const nestedNodes = [
			{
				type: 'p',
				children: [
					{ text: 'Bold ' },
					{ type: 'strong', children: [{ text: 'text' }] },
					{ text: ' and ' },
					{ type: 'em', children: [{ text: 'italic' }] }
				]
			}
		];
		expect(extractPlainText(nestedNodes)).toBe('Bold text and italic');

		// Test empty array
		expect(extractPlainText([])).toBe('');

		// Test null/undefined
		expect(extractPlainText(null)).toBe('');
		expect(extractPlainText(undefined)).toBe('');
	});

	test('locale-aware sorting with German umlauts', async () => {
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Zurich' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Aarau' }] }] }
						]
					},
					{
						key: 'row-4',
						cells: [
							{ key: 'cell-4-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Osterreich' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: { language: 'de' }, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');
		await fireEvent.click(headerCell!);

		// Get the sorted data cells
		const dataCells = container.querySelectorAll('tbody td');
		const cellTexts = Array.from(dataCells).map((cell) => cell.textContent);

		// With German locale, should be sorted: Aarau, Osterreich, Zurich
		expect(cellTexts).toEqual(['Aarau', 'Osterreich', 'Zurich']);
	});

	test('clicking different column resets to ascending order', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCells = container.querySelectorAll('th');

		// Click first header twice to get descending
		await fireEvent.click(headerCells[0]);
		await fireEvent.click(headerCells[0]);
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'descending');

		// Click second header - should reset to ascending
		await fireEvent.click(headerCells[1]);
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'none');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'ascending');
	});

	test('sorting not enabled when sortable is false', async () => {
		const data = {
			table: {
				sortable: false,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');

		// Should not have aria-sort when not sortable
		expect(headerCell).not.toHaveAttribute('aria-sort');

		// Clicking should not change anything
		await fireEvent.click(headerCell!);
		expect(headerCell).not.toHaveAttribute('aria-sort');
	});
});

describe('Slate Table Block - Accessibility', () => {
	// Helper to create sortable table data for accessibility tests
	function createSortableTableData() {
		return {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Age' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: '30' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Bob' }] }] },
							{ key: 'cell-3-2', type: 'data', value: [{ type: 'p', children: [{ text: '25' }] }] }
						]
					}
				]
			}
		};
	}

	test('aria-sort attribute values update based on sort state', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCells = container.querySelectorAll('th');

		// Initial state: all columns have aria-sort="none"
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'none');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'none');

		// Click first header - should be ascending
		await fireEvent.click(headerCells[0]);
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'ascending');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'none');

		// Click again - should be descending
		await fireEvent.click(headerCells[0]);
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'descending');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'none');

		// Click second column - first resets to none, second becomes ascending
		await fireEvent.click(headerCells[1]);
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'none');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'ascending');
	});

	test('tabindex attributes on header cells for keyboard focus', () => {
		// Test sortable table - headers should have tabindex="0"
		const sortableData = createSortableTableData();

		const { container: sortableContainer } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data: sortableData, properties: {}, path: '/test', metadata: undefined }
		});

		const sortableHeaders = sortableContainer.querySelectorAll('th');
		expect(sortableHeaders[0]).toHaveAttribute('tabindex', '0');
		expect(sortableHeaders[1]).toHaveAttribute('tabindex', '0');

		// Test non-sortable table - headers should have tabindex="-1"
		const nonSortableData = {
			table: {
				sortable: false,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Age' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: '30' }] }] }
						]
					}
				]
			}
		};

		const { container: nonSortableContainer } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data: nonSortableData, properties: {}, path: '/test', metadata: undefined }
		});

		const nonSortableHeaders = nonSortableContainer.querySelectorAll('th');
		expect(nonSortableHeaders[0]).toHaveAttribute('tabindex', '-1');
		expect(nonSortableHeaders[1]).toHaveAttribute('tabindex', '-1');
	});

	test('keyboard navigation - Enter key triggers sort', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');
		expect(headerCell).toBeInTheDocument();

		// Initial state
		expect(headerCell).toHaveAttribute('aria-sort', 'none');

		// Press Enter key
		await fireEvent.keyDown(headerCell!, { key: 'Enter' });
		expect(headerCell).toHaveAttribute('aria-sort', 'ascending');

		// Press Enter again
		await fireEvent.keyDown(headerCell!, { key: 'Enter' });
		expect(headerCell).toHaveAttribute('aria-sort', 'descending');
	});

	test('keyboard navigation - Space key triggers sort', async () => {
		const data = createSortableTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');
		expect(headerCell).toBeInTheDocument();

		// Initial state
		expect(headerCell).toHaveAttribute('aria-sort', 'none');

		// Press Space key
		await fireEvent.keyDown(headerCell!, { key: ' ' });
		expect(headerCell).toHaveAttribute('aria-sort', 'ascending');

		// Press Space again
		await fireEvent.keyDown(headerCell!, { key: ' ' });
		expect(headerCell).toHaveAttribute('aria-sort', 'descending');

		// Press Space on second column
		const headerCells = container.querySelectorAll('th');
		await fireEvent.keyDown(headerCells[1], { key: ' ' });
		expect(headerCells[0]).toHaveAttribute('aria-sort', 'none');
		expect(headerCells[1]).toHaveAttribute('aria-sort', 'ascending');
	});
});

describe('Slate Table Block - Styling and Responsive', () => {
	// Helper function to create table data
	function createTableData(options: Record<string, boolean> = {}) {
		return {
			table: {
				...options,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Age' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: '30' }] }] }
						]
					}
				]
			}
		};
	}

	test('horizontal scroll container renders correctly', () => {
		const data = createTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Check that the table is wrapped in a scroll container
		const scrollContainer = container.querySelector('.table-scroll-container');
		expect(scrollContainer).toBeInTheDocument();

		// The table should be inside the scroll container
		const table = scrollContainer?.querySelector('table');
		expect(table).toBeInTheDocument();
	});

	test('block wrapper has correct CSS class structure', () => {
		const data = createTableData();

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Check the block wrapper class
		const blockWrapper = container.querySelector('.block.slateTable');
		expect(blockWrapper).toBeInTheDocument();

		// Check that scroll container is a child of block wrapper
		const scrollContainer = blockWrapper?.querySelector('.table-scroll-container');
		expect(scrollContainer).toBeInTheDocument();
	});

	test('sortable headers have cursor pointer class applied', () => {
		const sortableData = createTableData({ sortable: true });

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data: sortableData, properties: {}, path: '/test', metadata: undefined }
		});

		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();
		expect(table).toHaveClass('slateTable--sortable');

		// Headers should be present and sortable (CSS will apply cursor:pointer via slateTable--sortable class)
		const headerCells = container.querySelectorAll('th');
		expect(headerCells.length).toBeGreaterThan(0);
	});
});

// Task Group 6: Strategic Integration Tests - Gap Analysis Coverage
describe('Slate Table Block - Integration Tests', () => {
	test('complete ascending sort workflow verifies actual row order', async () => {
		// Integration test: render table -> click sort -> verify data order
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Charlie' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] }
						]
					},
					{
						key: 'row-4',
						cells: [
							{ key: 'cell-4-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Bob' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Initial order (unsorted): Charlie, Alice, Bob
		let dataCells = container.querySelectorAll('tbody td');
		let cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Charlie', 'Alice', 'Bob']);

		// Click to sort ascending
		const headerCell = container.querySelector('th');
		await fireEvent.click(headerCell!);

		// Verify ascending order: Alice, Bob, Charlie
		dataCells = container.querySelectorAll('tbody td');
		cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Alice', 'Bob', 'Charlie']);
	});

	test('descending sort verifies actual row order', async () => {
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Charlie' }] }] }
						]
					},
					{
						key: 'row-4',
						cells: [
							{ key: 'cell-4-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Bob' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');

		// Click twice to get descending
		await fireEvent.click(headerCell!);
		await fireEvent.click(headerCell!);

		// Verify descending order: Charlie, Bob, Alice
		const dataCells = container.querySelectorAll('tbody td');
		const cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Charlie', 'Bob', 'Alice']);
	});

	test('numeric sorting with Intl.Collator numeric option', async () => {
		// Tests that numeric: true in Intl.Collator works correctly
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Item' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Item 10' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Item 2' }] }] }
						]
					},
					{
						key: 'row-4',
						cells: [
							{ key: 'cell-4-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Item 1' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');
		await fireEvent.click(headerCell!);

		// With numeric: true, should sort as: Item 1, Item 2, Item 10 (not Item 1, Item 10, Item 2)
		const dataCells = container.querySelectorAll('tbody td');
		const cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Item 1', 'Item 2', 'Item 10']);
	});

	test('header-only table (single row) renders correctly', () => {
		// Edge case: table with only a header row, no data rows
		const data = {
			table: {
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Column A' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'Column B' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Table should render with header row
		const table = container.querySelector('table');
		expect(table).toBeInTheDocument();

		const thead = container.querySelector('thead');
		expect(thead).toBeInTheDocument();

		const thElements = container.querySelectorAll('th');
		expect(thElements.length).toBe(2);
		expect(thElements[0]).toHaveTextContent('Column A');
		expect(thElements[1]).toHaveTextContent('Column B');

		// Tbody should be empty
		const tdElements = container.querySelectorAll('td');
		expect(tdElements.length).toBe(0);
	});

	test('handles missing table data gracefully', () => {
		// Edge case: data.table is undefined or null
		const data = {};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Block wrapper should exist but no table
		const blockDiv = container.querySelector('.block.slateTable');
		expect(blockDiv).toBeInTheDocument();

		const table = container.querySelector('table');
		expect(table).not.toBeInTheDocument();
	});

	test('cell content with links renders correctly via Slate', () => {
		// Integration: Slate cell content with link elements
		// Link component expects URL in data.url property
		const data = {
			table: {
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Resource' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{
								key: 'cell-2-1',
								type: 'data',
								value: [
									{
										type: 'p',
										children: [
											{ text: 'Visit ' },
											{
												type: 'link',
												data: {
													url: 'https://example.com'
												},
												children: [{ text: 'Example Site' }]
											}
										]
									}
								]
							}
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		// Link should be rendered in the table cell
		const link = container.querySelector('a');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveTextContent('Example Site');
	});

	test('keyboard sort with row order verification', async () => {
		// Integration: keyboard navigation + actual row order change
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Zara' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Adam' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCell = container.querySelector('th');

		// Use keyboard (Enter) to sort
		await fireEvent.keyDown(headerCell!, { key: 'Enter' });

		// Verify ascending order via keyboard interaction
		let dataCells = container.querySelectorAll('tbody td');
		let cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Adam', 'Zara']);

		// Use Space to toggle to descending
		await fireEvent.keyDown(headerCell!, { key: ' ' });

		dataCells = container.querySelectorAll('tbody td');
		cellTexts = Array.from(dataCells).map((cell) => cell.textContent);
		expect(cellTexts).toEqual(['Zara', 'Adam']);
	});

	test('multi-column sorting workflow with order verification', async () => {
		// Integration: switch between columns and verify row order
		const data = {
			table: {
				sortable: true,
				rows: [
					{
						key: 'row-1',
						cells: [
							{ key: 'cell-1-1', type: 'header', value: [{ type: 'p', children: [{ text: 'Name' }] }] },
							{ key: 'cell-1-2', type: 'header', value: [{ type: 'p', children: [{ text: 'City' }] }] }
						]
					},
					{
						key: 'row-2',
						cells: [
							{ key: 'cell-2-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Charlie' }] }] },
							{ key: 'cell-2-2', type: 'data', value: [{ type: 'p', children: [{ text: 'Berlin' }] }] }
						]
					},
					{
						key: 'row-3',
						cells: [
							{ key: 'cell-3-1', type: 'data', value: [{ type: 'p', children: [{ text: 'Alice' }] }] },
							{ key: 'cell-3-2', type: 'data', value: [{ type: 'p', children: [{ text: 'Munich' }] }] }
						]
					}
				]
			}
		};

		const { container } = render(SlateTableBlockView, {
			props: { key: 'test-key', id: 'test-id', data, properties: {}, path: '/test', metadata: undefined }
		});

		const headerCells = container.querySelectorAll('th');

		// Sort by first column (Name)
		await fireEvent.click(headerCells[0]);

		// Verify sorted by Name: Alice, Charlie
		let rows = container.querySelectorAll('tbody tr');
		expect(rows[0]).toHaveTextContent('Alice');
		expect(rows[0]).toHaveTextContent('Munich');
		expect(rows[1]).toHaveTextContent('Charlie');
		expect(rows[1]).toHaveTextContent('Berlin');

		// Switch to sort by second column (City)
		await fireEvent.click(headerCells[1]);

		// Verify sorted by City: Berlin (Charlie), Munich (Alice)
		rows = container.querySelectorAll('tbody tr');
		expect(rows[0]).toHaveTextContent('Charlie');
		expect(rows[0]).toHaveTextContent('Berlin');
		expect(rows[1]).toHaveTextContent('Alice');
		expect(rows[1]).toHaveTextContent('Munich');
	});
});
