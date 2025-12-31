<script lang="ts">
	import '../app.css';
	import blocks from '$lib/blocks';
	import config from '@plone/registry';

	// Apply blocks config (runs on both server and client)
	config.blocks.blocksConfig = {
		...config.blocks.blocksConfig,
		...blocks
	};

	let { children } = $props();
</script>

<main class="layout-wrapper">
	{@render children()}
</main>

<style>
	main {
		max-width: 1127px;
		margin: 0 auto;
	}
</style>
