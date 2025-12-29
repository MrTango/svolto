<script lang="ts">
	import DefaultBlockView from '$lib/blocks/DefaultBlockView.svelte';

	let { key, id, data, metadata, properties, path, blocksConfig = {} } = $props();

	// Guard clause: return early if blocks_layout is undefined
	const hasBlocksLayout = $derived(data?.blocks_layout !== undefined);

	// Compute column count from blocks_layout.items length
	const columnCount = $derived(data?.blocks_layout?.items?.length || 0);

	// Map column count to CSS class name (one, two, three, four)
	const columnCountClass = $derived(() => {
		const countMap: Record<number, string> = {
			1: 'one',
			2: 'two',
			3: 'three',
			4: 'four'
		};
		return countMap[columnCount] || 'one';
	});

	// Compute CSS classes for the grid container
	const blockClasses = $derived(() => {
		return `block grid ${columnCountClass()}`;
	});

	// Determine if headline should be displayed
	const showHeadline = $derived(!!data?.headline);

	// Allowed nested block types (excludes gridBlock to prevent infinite nesting)
	const allowedNestedBlocks = ['slate', 'image', 'teaser'];

	// Helper to get block component for a given block type
	function getBlockComponent(blockType: string | undefined) {
		if (!blockType || !allowedNestedBlocks.includes(blockType)) {
			return DefaultBlockView;
		}
		return blocksConfig[blockType]?.view || DefaultBlockView;
	}
</script>

{#if hasBlocksLayout}
	{#if showHeadline}
		<h2 class="headline">{data.headline}</h2>
	{/if}
	<div class={blockClasses()}>
		{#each data.blocks_layout.items as columnId}
			{@const blockData = data.blocks?.[columnId]}
			{@const blockType = blockData?.['@type']}
			{@const BlockComponent = getBlockComponent(blockType)}
			<div class="grid-column">
				<div class="VoltoBlock">
					<BlockComponent
						key={columnId}
						id={columnId}
						data={blockData}
						{metadata}
						{properties}
						{path}
						{blocksConfig}
					/>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	/* CSS Custom Properties for theming */
	.block.grid {
		--grid-gap: 1rem;
		--grid-column-min-width: 250px;
	}

	/* Flexbox grid container */
	.block.grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--grid-gap);
	}

	/* Column flex item base styles */
	.grid-column {
		flex-grow: 1;
		min-width: var(--grid-column-min-width);
	}

	/* Column width calculations based on column count */
	.block.grid.one .grid-column {
		flex-basis: 100%;
	}

	.block.grid.two .grid-column {
		flex-basis: calc(50% - var(--grid-gap) / 2);
	}

	.block.grid.three .grid-column {
		flex-basis: calc(33.333% - var(--grid-gap) * 2 / 3);
	}

	.block.grid.four .grid-column {
		flex-basis: calc(25% - var(--grid-gap) * 3 / 4);
	}

	/* Headline styling */
	.headline {
		margin-bottom: 1rem;
		width: 100%;
	}
</style>
