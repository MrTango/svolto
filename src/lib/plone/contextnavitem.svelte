<script>
	export let item;
	let items = item.items || [];
</script>

{#if item}
	<li>
		<a href={item.href}>{item.title}</a>
		{#if items}
			<ul>
				{#each items as item}
					<svelte:self {item} />
				{/each}
			</ul>
		{/if}
	</li>
{/if}
