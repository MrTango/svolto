<script lang="ts">
	import type { NavItem } from './types';
	import MegaNavColumn from './MegaNavColumn.svelte';

	interface Props {
		item: NavItem;
		panelId: string;
		onClose: () => void;
		onKeyDown?: (event: KeyboardEvent) => void;
	}

	let { item, panelId, onClose, onKeyDown }: Props = $props();

	const headerId = $derived(`${panelId}-header`);

	function handleKeyDown(event: KeyboardEvent) {
		onKeyDown?.(event);
	}
</script>

<div
	id={panelId}
	class="nav-mega__panel"
	role="region"
	aria-labelledby={headerId}
	onkeydown={handleKeyDown}
>
	<div class="nav-mega__panel-container">
		<div class="nav-mega__panel-header">
			<h2 id={headerId} class="nav-mega__panel-title">{item.title}</h2>
			<button
				type="button"
				class="nav-mega__close-btn"
				aria-label="Close navigation panel"
				onclick={onClose}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<div class="nav-mega__panel-content">
			{#if item.items && item.items.length > 0}
				<ul class="nav-mega__columns" role="menu">
					{#each item.items as level2Item}
						<li role="none">
							<MegaNavColumn item={level2Item} />
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<style>
	.nav-mega__panel {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		background-color: var(--nav-panel-bg, #0097a7);
		color: var(--nav-panel-text, #ffffff);
		max-height: var(--nav-mega-panel-max-height, 80vh);
		overflow-y: auto;
		z-index: 100;
	}

	.nav-mega__panel-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: var(--nav-panel-padding-y, 1.5rem) var(--nav-panel-padding-x, 2rem);
	}

	.nav-mega__panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.nav-mega__panel-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--nav-panel-text, #ffffff);
		margin: 0;
	}

	.nav-mega__close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--nav-mega-close-btn-size, 44px);
		height: var(--nav-mega-close-btn-size, 44px);
		padding: 0;
		background: transparent;
		border: none;
		color: var(--nav-panel-text, #ffffff);
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.nav-mega__close-btn:hover {
		background-color: var(--nav-panel-link-hover-bg, rgba(255, 255, 255, 0.1));
	}

	.nav-mega__close-btn:focus-visible {
		outline: 2px solid var(--nav-panel-text, #ffffff);
		outline-offset: 2px;
	}

	.nav-mega__panel-content {
		padding-bottom: 1rem;
	}

	.nav-mega__columns {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--nav-mega-columns-min-width, 200px), 1fr));
		gap: var(--nav-column-gap, 2rem);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-mega__columns > li {
		list-style: none;
	}
</style>
