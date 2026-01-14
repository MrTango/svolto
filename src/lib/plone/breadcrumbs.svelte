<script lang="ts">
	interface BreadcrumbItem {
		href?: string;
		title?: string;
	}

	interface Props {
		breadcrumbs?: BreadcrumbItem[];
	}

	let { breadcrumbs = [] }: Props = $props();
</script>

<ul class="breadcrumbs">
	<li><a href="/">Home</a></li>
	{#each breadcrumbs as item}
		<li><a href={item.href}>{item.title}</a></li>
	{/each}
</ul>
