<script lang="ts">
	export let data = {};
	// import RenderBlocks from '@plone/blocks/RenderBlocks/RenderBlocks';
	// import { sveltify } from "svelte-preprocess-react";
	import RenderBlocks from '$lib/RenderBlocks.svelte';
	import config from '@plone/registry';

	// const ReactRenderBlocks = sveltify(RenderBlocks);
	// const blocksConfig = config.blocks.blocksConfig;
	// console.log(blocksConfig);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#await data}
	loading
{:then content}
	<article class="card">
		<h2>{content['title']}</h2>
		<p>{content['@id']}</p>
		<h3>Volto Blocks</h3>
    <RenderBlocks content={content} blocksConfig={config.blocks.blocksConfig} pathname="/" />
		<!-- <ReactRenderBlocks content={content} blocksConfig={config.blocks.blocksConfig} pathname="/" /> -->
	</article>
{/await}


<style lang="scss">
	// h1 {
	// 	color: green;
	// 	font-size: 3.5rem;
	// }
	// h2{
	//   font-size: 2.2rem;
	// }
</style>
