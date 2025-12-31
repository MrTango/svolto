<script lang="ts">
	import DefaultBlockView from '$lib/blocks/DefaultBlockView.svelte';
	import type { ListingResponse } from '$lib/blocks/listing/types';

	let {
		content,
		blocksConfig = {},
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
		{@const BlockComponent = blocksConfig[blockType]?.view || DefaultBlockView}
		<!-- {@debug blockData} -->
		<div class="VoltoBlock">
			{#if BlockComponent === DefaultBlockView}
				<p>block: {block} [{blockType}]</p>
			{/if}
			<BlockComponent
				key={block}
				id={block}
				data={blockData}
				{metadata}
				properties={content}
				path={pathname}
				{blocksConfig}
				initialListingData={listingData[block]}
				page={listingPages[block] ?? 1}
				{listingData}
				{listingPages}
				{paginatedBlockCount}
			/>
		</div>
	{/each}
{/if}
