<script lang="ts">
	import RenderBlocks from '$lib/RenderBlocks.svelte';
	import config from '@plone/registry';

	let { data } = $props();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<article class="card">
	<h2>{data['title']}</h2>
	<p>{data['@id']}</p>
	<h3>Volto Blocks</h3>
	<RenderBlocks
		content={data}
		blocksConfig={config.blocks.blocksConfig}
		pathname="/"
		listingData={data.listingData}
		listingPages={data.listingPages}
		paginatedBlockCount={data.paginatedBlockCount}
	/>
</article>

<style>
	h1 {
		color: green;
		font-size: 3.5rem;
	}
	h2 {
		font-size: 2.2rem;
	}
</style>
