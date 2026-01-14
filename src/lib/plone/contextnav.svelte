<script lang="ts">
	import Contextnavitem from '$lib/plone/contextnavitem.svelte';

	interface ContextNavItem {
		href?: string;
		title?: string;
		items?: ContextNavItem[];
	}

	interface ContextNavData {
		items?: ContextNavItem[];
	}

	export let contextNav: ContextNavData | undefined = undefined;
	let items: ContextNavItem[] = (contextNav && contextNav.items) || [];
</script>

<nav aria-label="contextnav">
	<ul>
		{#each items as item}
			<Contextnavitem {item} />
		{/each}
	</ul>
</nav>

<style>
	nav {
		border-left: 2px solid lightblue;
		padding-left: 1em;
	}
</style>
