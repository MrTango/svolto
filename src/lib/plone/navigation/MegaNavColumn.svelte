<script lang="ts">
	import type { NavItem } from './types';

	interface Props {
		item: NavItem;
	}

	let { item }: Props = $props();
</script>

<div class="nav-mega__column">
	<a href={item.href} class="nav-mega__l2-header" role="menuitem">
		{item.title}
	</a>

	{#if item.items && item.items.length > 0}
		<ul class="nav-mega__l3-list">
			{#each item.items as level3Item}
				<li>
					<a href={level3Item.href} class="nav-mega__l3-item" role="menuitem">
						{level3Item.title}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.nav-mega__column {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.nav-mega__l2-header {
		display: block;
		font-size: var(--nav-l2-font-size, 1rem);
		font-weight: var(--nav-l2-font-weight, 600);
		color: var(--nav-panel-text, #ffffff);
		text-decoration: none;
		padding-bottom: 0.5rem;
		margin-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}

	.nav-mega__l2-header:hover {
		text-decoration: underline;
	}

	.nav-mega__l2-header:focus-visible {
		outline: 2px solid var(--nav-panel-text, #ffffff);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.nav-mega__l3-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.nav-mega__l3-item {
		display: block;
		font-size: var(--nav-l3-font-size, 0.9375rem);
		font-weight: var(--nav-l3-font-weight, 400);
		color: var(--nav-panel-text, #ffffff);
		text-decoration: none;
		padding: 0.25rem 0;
		transition: background-color 0.2s ease;
	}

	.nav-mega__l3-item:hover {
		text-decoration: underline;
	}

	.nav-mega__l3-item:focus-visible {
		outline: 2px solid var(--nav-panel-text, #ffffff);
		outline-offset: 2px;
		border-radius: 2px;
	}
</style>
