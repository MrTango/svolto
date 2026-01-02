<script lang="ts">
	import type { NavItem } from './types';
	import MobileNavTrigger from './MobileNavTrigger.svelte';
	import MobileNavList from './MobileNavList.svelte';

	interface Props {
		navigation: NavItem[];
		currentPath: string;
	}

	let { navigation, currentPath }: Props = $props();

	let isOpen = $state(false);
	let expandedItems = $state<Set<string>>(new Set());

	function toggleMenu() {
		isOpen = !isOpen;
		if (!isOpen) {
			expandedItems = new Set();
		}
	}

	function handleToggle(href: string) {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(href)) {
			newExpanded.delete(href);
		} else {
			newExpanded.add(href);
		}
		expandedItems = newExpanded;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			isOpen = false;
			expandedItems = new Set();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<nav class="nav-mobile" aria-label="Mobile navigation">
	<MobileNavTrigger {isOpen} onclick={toggleMenu} />

	{#if isOpen}
		<div class="nav-mobile__overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
			<div class="nav-mobile__content">
				<!-- Home link at top -->
				<a href="/" class="nav-mobile__home">
					Startseite
				</a>
				<div class="nav-mobile__home-separator"></div>

				<!-- Navigation items -->
				<MobileNavList
					items={navigation}
					level={1}
					{expandedItems}
					onToggle={handleToggle}
				/>
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-mobile {
		display: block;
	}

	.nav-mobile__overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--nav-mobile-bg, #0097a7);
		z-index: var(--nav-mobile-z-index, 1000);
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.nav-mobile__content {
		padding-top: var(--nav-mobile-content-padding-top, 5rem);
		padding-bottom: var(--nav-mobile-content-padding-bottom, 2rem);
	}

	.nav-mobile__home {
		display: block;
		padding: var(--nav-mobile-home-padding, 0.875rem 1rem);
		font-size: var(--nav-mobile-home-font-size, 1rem);
		color: var(--nav-mobile-home-color, #ffffff);
		text-decoration: none;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.nav-mobile__home:hover {
		background-color: var(--nav-mobile-item-hover-bg, rgba(255, 255, 255, 0.1));
	}

	.nav-mobile__home:focus-visible {
		outline: 2px solid var(--nav-mobile-focus-color, rgba(255, 255, 255, 0.8));
		outline-offset: -2px;
	}

	.nav-mobile__home-separator {
		height: 1px;
		background-color: var(--nav-mobile-separator-color, rgba(255, 255, 255, 0.2));
		margin: 0 var(--nav-mobile-separator-margin, 1rem);
	}

	/* Responsive: Only show on mobile */
	@media (min-width: 1024px) {
		.nav-mobile {
			display: none;
		}
	}
</style>
