<script lang="ts">
	import RenderBlock from '$lib/RenderBlock.svelte';
	import type { ListingResponse } from '$lib/blocks/listing/types';
	import type { BlockConfig } from '$lib/blocks/index';

	let {
		content,
		blocksConfig = {} as Record<string, BlockConfig>,
		pathname,
		metadata = undefined,
		listingData = {} as Record<string, ListingResponse>,
		listingPages = {} as Record<string, number>,
		paginatedBlockCount = 1
	} = $props();
</script>

{#if content?.blocks_layout?.items}
	{#each content.blocks_layout.items as block}
		{@const blockData = content.blocks?.[block]}
		{@const blockType = blockData?.['@type']}
		{@const blockConfig = blocksConfig[blockType]}
		<RenderBlock
			{block}
			{blockData}
			{blockType}
			{blockConfig}
			{content}
			{pathname}
			{metadata}
			{listingData}
			{listingPages}
			{paginatedBlockCount}
			{blocksConfig}
		/>
	{/each}
{/if}
