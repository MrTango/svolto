<script lang="ts">
	import RenderBlock from '$lib/RenderBlock.svelte';
	import type { ListingResponse } from '$lib/blocks/listing/types';
	import type { BlockConfig } from '$lib/blocks/index';

	let {
		key,
		id,
		data,
		metadata,
		properties,
		path,
		blocksConfig = {} as Record<string, BlockConfig>,
		listingData = {} as Record<string, ListingResponse>,
		listingPages = {} as Record<string, number>,
		paginatedBlockCount = 1
	} = $props();

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
	const allowedNestedBlocks = new Set(['slate', 'image', 'teaser', 'listing', 'description', 'title', 'introduction']);

	// Create a filtered blocksConfig without gridBlock
	const nestedBlocksConfig = $derived(() => {
		const filtered: Record<string, BlockConfig> = {};
		for (const [blockType, config] of Object.entries(blocksConfig)) {
			if (allowedNestedBlocks.has(blockType)) {
				filtered[blockType] = config;
			}
		}
		return filtered;
	});
</script>

{#if hasBlocksLayout}
	{#if showHeadline}
		<h2 class="headline">{data.headline}</h2>
	{/if}
	<div class={blockClasses()}>
		{#each data.blocks_layout.items as columnId}
			{@const blockData = data.blocks?.[columnId]}
			{@const blockType = blockData?.['@type']}
			{@const blockConfig = nestedBlocksConfig()[blockType]}
			<div class="grid-column">
				<RenderBlock
					block={columnId}
					{blockData}
					{blockType}
					{blockConfig}
					content={data}
					pathname={path}
					{metadata}
					{listingData}
					{listingPages}
					{paginatedBlockCount}
					blocksConfig={nestedBlocksConfig()}
				/>
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
