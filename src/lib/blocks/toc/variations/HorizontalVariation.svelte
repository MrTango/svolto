<script lang="ts">
	import type { TocEntry } from '../types';

	let {
		entries = [],
		sticky = false
	}: {
		entries: TocEntry[];
		sticky?: boolean;
	} = $props();

	function flattenEntries(items: TocEntry[]): TocEntry[] {
		const result: TocEntry[] = [];
		for (const item of items) {
			result.push(item);
			if (item.children && item.children.length > 0) {
				result.push(...flattenEntries(item.children));
			}
		}
		return result;
	}

	const flatEntries = $derived(flattenEntries(entries));
</script>

<div class="toc-horizontal" class:toc-sticky={sticky}>
	<ul class="toc-menu">
		{#each flatEntries as entry}
			<li class="toc-menu-item">
				<a href="#{entry.id}" class="toc-menu-link">{entry.title}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.toc-horizontal {
		--toc-menu-gap: 1.5rem;
		--toc-link-color: var(--color-text, #333);
		--toc-link-hover-color: var(--color-primary, #0066cc);
		--toc-bg-color: var(--color-surface, #ffffff);
		--toc-sticky-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		background-color: var(--toc-bg-color);
		padding: 0.75rem 0;
	}

	.toc-sticky {
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: var(--toc-sticky-shadow);
	}

	.toc-menu {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--toc-menu-gap);
		align-items: center;
	}

	.toc-menu-item {
		flex-shrink: 0;
	}

	.toc-menu-link {
		color: var(--toc-link-color);
		text-decoration: none;
		font-weight: 500;
		padding: 0.25rem 0;
		border-bottom: 2px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.toc-menu-link:hover {
		color: var(--toc-link-hover-color);
		border-bottom-color: var(--toc-link-hover-color);
	}

	.toc-menu-link:focus {
		outline: 2px solid var(--toc-link-hover-color);
		outline-offset: 2px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.toc-horizontal {
			--toc-menu-gap: 1rem;
		}

		.toc-menu-link {
			font-size: 0.875rem;
		}
	}
</style>
