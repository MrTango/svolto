<script lang="ts">
	import type { NavItem } from './types';

	interface Props {
		item: NavItem;
		level: number;
		isExpanded: boolean;
		onToggle: (href: string) => void;
	}

	let { item, level, isExpanded, onToggle }: Props = $props();

	const hasChildren = $derived(item.items && item.items.length > 0);

	function handleClick(event: MouseEvent) {
		if (hasChildren) {
			event.preventDefault();
			onToggle(item.href);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (hasChildren && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			onToggle(item.href);
		}
	}
</script>

{#if hasChildren}
	<button
		type="button"
		class="nav-mobile__item nav-mobile__item--level-{level}"
		class:nav-mobile__item--expanded={isExpanded}
		data-nav-item={item.href}
		aria-expanded={isExpanded}
		onclick={handleClick}
		onkeydown={handleKeyDown}
	>
		<span class="nav-mobile__item-title">{item.title}</span>
		<span
			class="nav-mobile__chevron"
			class:nav-mobile__chevron--expanded={isExpanded}
			aria-hidden="true"
		>
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4.5 2.5L8 6L4.5 9.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</button>
{:else}
	<a href={item.href} class="nav-mobile__item nav-mobile__item--level-{level}" data-nav-item={item.href}>
		<span class="nav-mobile__item-title">{item.title}</span>
	</a>
{/if}

<style>
	.nav-mobile__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--nav-mobile-item-padding, 0.875rem 1rem);
		font-size: var(--nav-mobile-item-font-size, 1rem);
		color: var(--nav-mobile-item-color, #ffffff);
		text-decoration: none;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		min-height: 44px;
	}

	.nav-mobile__item:focus-visible {
		outline: 2px solid var(--nav-mobile-focus-color, rgba(255, 255, 255, 0.8));
		outline-offset: -2px;
	}

	/* Indentation based on level */
	.nav-mobile__item--level-2 {
		padding-left: var(--nav-mobile-indent-level-2, 2rem);
		font-size: var(--nav-mobile-item-font-size-small, 0.9375rem);
	}

	.nav-mobile__item--level-3 {
		padding-left: var(--nav-mobile-indent-level-3, 3rem);
		font-size: var(--nav-mobile-item-font-size-small, 0.9375rem);
	}

	.nav-mobile__item-title {
		flex: 1;
	}

	.nav-mobile__chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease;
	}

	.nav-mobile__chevron--expanded {
		transform: rotate(90deg);
	}

	.nav-mobile__chevron svg {
		width: 12px;
		height: 12px;
	}

	/* Button-specific reset */
	button.nav-mobile__item {
		font-family: inherit;
	}

	/* Anchor-specific styling */
	a.nav-mobile__item:hover {
		background-color: var(--nav-mobile-item-hover-bg, rgba(255, 255, 255, 0.1));
	}

	button.nav-mobile__item:hover {
		background-color: var(--nav-mobile-item-hover-bg, rgba(255, 255, 255, 0.1));
	}
</style>
