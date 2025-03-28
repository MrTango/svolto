<script lang="ts">
	import DefaultBlockView from '$lib/blocks/DefaultBlockView.svelte';
	let { content, blocksConfig = {}, pathname } = $props();

</script>

{#if content}
	{#each content.blocks_layout.items as block}
		{@const blockData = content.blocks?.[block]}
		{@const blockType = blockData?.['@type']}
		{@const BlockComponent = blocksConfig[blockType]?.view || DefaultBlockView}
		<!-- {@debug blockData} -->
		<div class="VoltoBlock">
			<p>block: {block} [{blockType}]</p>
			<BlockComponent key={block} id={block} data={blockData} />
		</div>
	{/each}
{/if}
