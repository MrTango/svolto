<script lang="ts">
	import { page } from '$app/stores';
	import blocks from '$lib/blocks';
	import { Navigation } from '$lib/plone/navigation';
	import config from '@plone/registry';
	import '../app.css';

	// Apply blocks config (runs on both server and client)
	config.blocks.blocksConfig = {
		...config.blocks.blocksConfig,
		...blocks
	};

	let { data, children } = $props();

	let currentPath = $derived('/' + ($page.params.path || ''));
</script>

<header class="site-header">
	<Navigation navigation={data.navigation?.items ?? []} {currentPath} />
</header>

<main class="layout-wrapper">
	{@render children()}
</main>

<style>
	.site-header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0.5rem 1rem;
	}

	.navigation-wrapper {
		max-width: 1127px;
		margin: 0 auto;
	}

	main {
		max-width: 1127px;
		margin: 0 auto;
	}
</style>
