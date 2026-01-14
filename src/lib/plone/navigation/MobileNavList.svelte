<script lang="ts">
	import type { NavItem } from './types';
	import MobileNavItem from './MobileNavItem.svelte';
	import MobileNavList from './MobileNavList.svelte';

	interface Props {
		items: NavItem[];
		level: number;
		expandedItems: Set<string>;
		onToggle: (href: string) => void;
		onClose?: () => void;
		parentItem?: NavItem;
	}

	let { items, level, expandedItems, onToggle, onClose, parentItem }: Props = $props();

	function handleParentLinkClick() {
		onClose?.();
	}
</script>

<ul class="nav-mobile__list nav-mobile__list--level-{level}">
	{#if parentItem && level > 1}
		<li class="nav-mobile__list-item nav-mobile__list-item--parent-link">
			<a
				href={parentItem.href}
				class="nav-mobile__parent-link nav-mobile__parent-link--level-{level}"
				data-nav-parent-link={parentItem.href}
				onclick={handleParentLinkClick}
			>
				<span class="nav-mobile__parent-link-title">{parentItem.title}</span>
				<span class="nav-mobile__parent-link-indicator" aria-hidden="true">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
			<div class="nav-mobile__separator"></div>
		</li>
	{/if}
	{#each items as item (item.href)}
		{@const isExpanded = expandedItems.has(item.href)}
		{@const hasChildren = item.items && item.items.length > 0}
		<li class="nav-mobile__list-item">
			<MobileNavItem {item} {level} {isExpanded} {onToggle} {onClose} />

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
						{onClose}
						parentItem={item}
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

	/* Parent link styling - appears at top of expanded section */
	.nav-mobile__parent-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--nav-mobile-item-padding, 0.875rem 1rem);
		font-size: var(--nav-mobile-item-font-size, 1rem);
		font-weight: 600;
		color: var(--nav-mobile-item-color, #ffffff);
		text-decoration: none;
		background-color: var(--nav-mobile-parent-link-bg, rgba(255, 255, 255, 0.05));
		min-height: 44px;
	}

	.nav-mobile__parent-link--level-2 {
		padding-left: var(--nav-mobile-indent-level-2, 2rem);
	}

	.nav-mobile__parent-link--level-3 {
		padding-left: var(--nav-mobile-indent-level-3, 3rem);
	}

	.nav-mobile__parent-link:hover {
		background-color: var(--nav-mobile-item-hover-bg, rgba(255, 255, 255, 0.1));
	}

	.nav-mobile__parent-link:focus-visible {
		outline: 2px solid var(--nav-mobile-focus-color, rgba(255, 255, 255, 0.8));
		outline-offset: -2px;
	}

	.nav-mobile__parent-link-title {
		flex: 1;
	}

	.nav-mobile__parent-link-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
	}

	.nav-mobile__parent-link-indicator svg {
		width: 12px;
		height: 12px;
	}
</style>
