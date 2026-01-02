<script lang="ts">
	import type { NavItem } from './types';
	import MobileNavItem from './MobileNavItem.svelte';
	import MobileNavList from './MobileNavList.svelte';

	interface Props {
		items: NavItem[];
		level: number;
		expandedItems: Set<string>;
		onToggle: (href: string) => void;
	}

	let { items, level, expandedItems, onToggle }: Props = $props();
</script>

<ul class="nav-mobile__list nav-mobile__list--level-{level}">
	{#each items as item (item.href)}
		{@const isExpanded = expandedItems.has(item.href)}
		{@const hasChildren = item.items && item.items.length > 0}
		<li class="nav-mobile__list-item">
			<MobileNavItem {item} {level} {isExpanded} {onToggle} />

			{#if hasChildren && isExpanded}
				<div
					class="nav-mobile__nested"
					class:nav-mobile__nested--expanded={isExpanded}
				>
					<MobileNavList
						items={item.items || []}
						level={level + 1}
						{expandedItems}
						{onToggle}
					/>
				</div>
			{/if}

			<div class="nav-mobile__separator"></div>
		</li>
	{/each}
</ul>

<style>
	.nav-mobile__list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-mobile__list-item {
		position: relative;
	}

	.nav-mobile__separator {
		height: 1px;
		background-color: var(--nav-mobile-separator-color, rgba(255, 255, 255, 0.2));
		margin: 0 var(--nav-mobile-separator-margin, 1rem);
	}

	.nav-mobile__nested {
		overflow: hidden;
		max-height: 0;
		transition: max-height 0.3s ease-out;
	}

	.nav-mobile__nested--expanded {
		max-height: 2000px;
		transition: max-height 0.5s ease-in;
	}

	/* Level 2+ lists have slightly different styling */
	.nav-mobile__list--level-2,
	.nav-mobile__list--level-3 {
		background-color: var(--nav-mobile-nested-bg, rgba(0, 0, 0, 0.1));
	}
</style>
