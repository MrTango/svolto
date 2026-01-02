<script lang="ts">
	interface ContextNavItem {
		href?: string;
		title?: string;
		items?: ContextNavItem[];
	}

	export let item: ContextNavItem;
	let items: ContextNavItem[] = item.items || [];
</script>

{#if item}
	<li>
		<a href={item.href}>{item.title}</a>
		{#if items && items.length > 0}
			<ul>
				{#each items as subItem}
					<svelte:self item={subItem} />
				{/each}
			</ul>
		{/if}
	</li>
{/if}
