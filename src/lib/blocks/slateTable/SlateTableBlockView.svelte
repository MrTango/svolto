<script lang="ts" module>
	// Utility function to extract plain text from Slate node arrays
	// Exported for testing
	export function extractPlainText(nodes: unknown): string {
		if (!nodes || !Array.isArray(nodes)) {
			return '';
		}

		let text = '';

		function traverse(node: unknown): void {
			if (!node || typeof node !== 'object') {
				return;
			}

			const nodeObj = node as Record<string, unknown>;

			// If this is a text node, extract the text
			if ('text' in nodeObj && typeof nodeObj.text === 'string') {
				text += nodeObj.text;
				return;
			}

			// If this node has children, traverse them
			if ('children' in nodeObj && Array.isArray(nodeObj.children)) {
				for (const child of nodeObj.children) {
					traverse(child);
				}
			}
		}

		for (const node of nodes) {
			traverse(node);
		}

		return text;
	}
</script>

<script lang="ts">
	import Leaf from '$lib/blocks/slate/Leaf.svelte';

	let { key, id, data, properties, path, metadata } = $props();

	// Extract table data
	const tableData = $derived(data?.table);
	const rows = $derived(tableData?.rows || []);
	const hasRows = $derived(rows.length > 0);

	// First row is the header row
	const headerRow = $derived(hasRows ? rows[0] : null);
	const dataRows = $derived(hasRows ? rows.slice(1) : []);

	// Extract display options from data.table
	const hideHeaders = $derived(tableData?.hideHeaders ?? false);
	const sortable = $derived(tableData?.sortable ?? false);
	const fixed = $derived(tableData?.fixed ?? false);
	const compact = $derived(tableData?.compact ?? false);
	const basic = $derived(tableData?.basic ?? false);
	const celled = $derived(tableData?.celled ?? false);
	const inverted = $derived(tableData?.inverted ?? false);
	const striped = $derived(tableData?.striped ?? false);

	// Sorting state (Task 3.2)
	let sortState = $state<{ column: number | null; direction: 'ascending' | 'descending' | null }>({
		column: null,
		direction: null
	});

	// Get locale for collation (Task 3.4)
	const locale = $derived(() => {
		if (properties?.language) {
			return properties.language;
		}
		if (typeof navigator !== 'undefined' && navigator.language) {
			return navigator.language;
		}
		return 'en';
	});

	// Create collator for locale-aware sorting (Task 3.4)
	const collator = $derived(() => {
		return new Intl.Collator(locale(), { sensitivity: 'base', numeric: true });
	});

	// Sort click handler (Task 3.5)
	function handleSort(columnIndex: number): void {
		if (!sortable) return;

		if (sortState.column === columnIndex) {
			// Toggle direction on same column: ascending -> descending -> ascending
			sortState = {
				column: columnIndex,
				direction: sortState.direction === 'ascending' ? 'descending' : 'ascending'
			};
		} else {
			// First click on new column sets ascending order
			sortState = {
				column: columnIndex,
				direction: 'ascending'
			};
		}
	}

	// Keyboard handler for sorting (Task 4.3)
	function handleKeyDown(event: KeyboardEvent, columnIndex: number): void {
		if (!sortable) return;

		// Handle Enter and Space keys
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSort(columnIndex);
		}
	}

	// Compute sorted rows using $derived (Task 3.5)
	const sortedDataRows = $derived(() => {
		if (!sortable || sortState.column === null || sortState.direction === null) {
			return dataRows;
		}

		const columnIndex = sortState.column;
		const direction = sortState.direction;
		const coll = collator();

		// Create a copy and sort
		return [...dataRows].sort((a, b) => {
			const aText = extractPlainText(a.cells[columnIndex]?.value);
			const bText = extractPlainText(b.cells[columnIndex]?.value);

			const comparison = coll.compare(aText, bText);
			return direction === 'ascending' ? comparison : -comparison;
		});
	});

	// Get aria-sort value for a column (Task 4.2)
	function getAriaSort(columnIndex: number): 'ascending' | 'descending' | 'none' {
		if (sortState.column === columnIndex && sortState.direction) {
			return sortState.direction;
		}
		return 'none';
	}

	// Get tabindex value for header cells (Task 4.3)
	function getTabIndex(): number {
		return sortable ? 0 : -1;
	}

	// Compute CSS modifier classes dynamically
	const tableClasses = $derived(() => {
		const classes: string[] = [];
		if (hideHeaders) classes.push('slateTable--hide-headers');
		if (sortable) classes.push('slateTable--sortable');
		if (fixed) classes.push('slateTable--fixed');
		if (compact) classes.push('slateTable--compact');
		if (basic) classes.push('slateTable--basic');
		if (celled) classes.push('slateTable--celled');
		if (inverted) classes.push('slateTable--inverted');
		if (striped) classes.push('slateTable--striped');
		return classes.join(' ');
	});
</script>

<div class="block slateTable">
	{#if hasRows && headerRow}
		<div class="table-scroll-container">
			<table class={tableClasses()}>
				{#if !hideHeaders}
					<thead>
						<tr>
							{#each headerRow.cells as cell, cellIndex (cell.key)}
								<th
									scope="col"
									aria-sort={sortable ? getAriaSort(cellIndex) : undefined}
									tabindex={getTabIndex()}
									onclick={() => handleSort(cellIndex)}
									onkeydown={(e) => handleKeyDown(e, cellIndex)}
								>
									{#if cell.value && cell.value.length > 0}
										{#each cell.value as node}
											<Leaf {node} parent={null} />
										{/each}
									{:else}
										{'\u00A0'}
									{/if}
								</th>
							{/each}
						</tr>
					</thead>
				{/if}
				<tbody>
					{#each sortedDataRows() as row (row.key)}
						<tr>
							{#each row.cells as cell (cell.key)}
								<td>
									{#if cell.value && cell.value.length > 0}
										{#each cell.value as node}
											<Leaf {node} parent={null} />
										{/each}
									{:else}
										{'\u00A0'}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
