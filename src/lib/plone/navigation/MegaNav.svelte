<script lang="ts">
	import type { NavItem } from './types';
	import MegaNavItem from './MegaNavItem.svelte';
	import MegaNavPanel from './MegaNavPanel.svelte';

	interface Props {
		navigation: NavItem[];
		currentPath: string;
	}

	let { navigation, currentPath }: Props = $props();

	let openPanelId: string | null = $state(null);

	function generatePanelId(item: NavItem): string {
		const slug = item.href.replace(/^\//, '').replace(/\//g, '-') || 'home';
		return `nav-mega-panel-${slug}`;
	}

	function handleItemClick(item: NavItem) {
		const panelId = generatePanelId(item);
		if (openPanelId === panelId) {
			openPanelId = null;
		} else {
			openPanelId = panelId;
		}
	}

	function handleClosePanel() {
		const panelIdToRestore = openPanelId;
		openPanelId = null;

		// Return focus to the trigger that opened this panel
		if (panelIdToRestore) {
			requestAnimationFrame(() => {
				const trigger = document.querySelector<HTMLElement>(
					`[aria-controls="${panelIdToRestore}"]`
				);
				trigger?.focus();
			});
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && openPanelId) {
			event.preventDefault();
			handleClosePanel();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const navElement = target.closest('.nav-mega');
		if (!navElement && openPanelId) {
			openPanelId = null;
		}
	}

	function isItemActive(item: NavItem): boolean {
		if (currentPath === item.href) return true;
		return currentPath.startsWith(item.href + '/');
	}

	function handleFocusTrap(event: KeyboardEvent, panelId: string) {
		if (event.key !== 'Tab' || openPanelId !== panelId) return;

		const panel = document.getElementById(panelId);
		if (!panel) return;

		const focusableElements = panel.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleClickOutside} />

<nav class="nav-mega" aria-label="Main navigation">
	<ul class="nav-mega__bar">
		{#each navigation as item}
			{@const hasChildren = item.items && item.items.length > 0}
			{@const panelId = generatePanelId(item)}
			{@const isOpen = openPanelId === panelId}
			{@const isActive = isItemActive(item)}

			<li class="nav-mega__bar-item">
				<MegaNavItem
					{item}
					{isActive}
					{isOpen}
					{panelId}
					onClick={() => handleItemClick(item)}
					onKeyDown={(e) => handleFocusTrap(e, panelId)}
				/>
			</li>
		{/each}
	</ul>

	{#each navigation as item}
		{@const hasChildren = item.items && item.items.length > 0}
		{@const panelId = generatePanelId(item)}
		{@const isOpen = openPanelId === panelId}

		{#if hasChildren && isOpen}
			<MegaNavPanel
				{item}
				{panelId}
				onClose={handleClosePanel}
				onKeyDown={(e) => handleFocusTrap(e, panelId)}
			/>
		{/if}
	{/each}
</nav>

<style>
	.nav-mega {
		display: none;
		position: relative;
	}

	/* Desktop only: show at 1024px+ */
	@media (min-width: 1024px) {
		.nav-mega {
			display: block;
		}
	}

	.nav-mega__bar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--nav-gap, 0.5rem);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-mega__bar-item {
		position: relative;
	}
</style>
