<script>
	import Contextnavitem from '$lib/plone/contextnavitem.svelte';
	export let contextNav;
	let items = (contextNav && contextNav.items) || [];
</script>

<nav name="contextnav">
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
