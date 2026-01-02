<script lang="ts">
	interface BreadcrumbItem {
		href?: string;
		title?: string;
	}

	export let breadcrumbs: BreadcrumbItem[] = [];
</script>

<ul>
	<li><a href="/">Home</a></li>
	{#each breadcrumbs as item}
		<li><a href={item.href}>{item.title}</a></li>
	{/each}
</ul>

<style>
</style>
