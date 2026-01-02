<script lang="ts">
	import type { NavItem } from './types';

	interface Props {
		item: NavItem;
		isActive: boolean;
		isOpen: boolean;
		panelId: string;
		onClick: () => void;
		onKeyDown?: (event: KeyboardEvent) => void;
	}

	let { item, isActive, isOpen, panelId, onClick, onKeyDown }: Props = $props();

	const hasChildren = $derived(item.items && item.items.length > 0);

	const itemClasses = $derived(() => {
		let classes = 'nav-mega__item';
		if (isActive) classes += ' nav-mega__item--active';
		if (isOpen) classes += ' nav-mega__item--open';
		return classes;
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onClick();
		}
		onKeyDown?.(event);
	}
</script>

{#if hasChildren}
	<button
		type="button"
		class={itemClasses()}
		aria-expanded={isOpen}
		aria-haspopup="true"
		aria-controls={panelId}
		aria-current={isActive ? 'page' : undefined}
		onclick={onClick}
		onkeydown={handleKeyDown}
	>
		{item.title}
	</button>
{:else}
	<a
		href={item.href}
		class={itemClasses()}
		aria-current={isActive ? 'page' : undefined}
	>
		{item.title}
	</a>
{/if}

<style>
	.nav-mega__item {
		display: inline-flex;
		align-items: center;
		padding: var(--nav-mega-item-padding, 0.75rem 1rem);
		font-size: var(--nav-font-size, 1rem);
		font-weight: 500;
		color: var(--nav-panel-bg, #0097a7);
		text-decoration: none;
		background: transparent;
		border: none;
		cursor: pointer;
		position: relative;
		transition: color 0.2s ease;
	}

	.nav-mega__item:hover {
		color: var(--nav-active-indicator, #1f2937);
	}

	.nav-mega__item:focus-visible {
		outline: 2px solid var(--nav-focus-color, #0097a7);
		outline-offset: var(--nav-focus-ring-offset, 2px);
		border-radius: 4px;
	}

	.nav-mega__item--active {
		color: var(--nav-active-indicator, #1f2937);
	}

	.nav-mega__item--active::after {
		content: '';
		position: absolute;
		bottom: var(--nav-mega-active-underline-offset, -3px);
		left: var(--nav-mega-item-padding, 1rem);
		right: var(--nav-mega-item-padding, 1rem);
		height: var(--nav-mega-active-underline-height, 3px);
		background-color: var(--nav-active-indicator, #1f2937);
	}

	.nav-mega__item--open {
		color: var(--nav-active-indicator, #1f2937);
	}

	button.nav-mega__item {
		font-family: inherit;
	}
</style>
