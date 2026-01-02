<script lang="ts">
	import type { TocBlockData, PageBlocks, BlocksLayout } from './types';
	import { extractHeadingsFromBlocks } from './utils';
	import { getVariationComponent } from './variations/index';

	let {
		key,
		id,
		data = {} as TocBlockData,
		metadata,
		properties,
		path,
		blocksConfig
	}: {
		key: string;
		id: string;
		data: TocBlockData;
		metadata?: Record<string, unknown>;
		properties?: {
			blocks?: PageBlocks;
			blocks_layout?: BlocksLayout;
			[key: string]: unknown;
		};
		path?: string;
		blocksConfig?: Record<string, unknown>;
	} = $props();

	const DEFAULT_LEVELS = ['h2', 'h3', 'h4', 'h5', 'h6'];

	const levels = $derived(data?.levels || DEFAULT_LEVELS);

	const entries = $derived(
		properties?.blocks && properties?.blocks_layout
			? extractHeadingsFromBlocks(properties.blocks, properties.blocks_layout, levels)
			: []
	);

	const showTitle = $derived(!!data?.title && !data?.hide_title);

	const ariaLabel = $derived(data?.title || 'Table of Contents');

	const variationName = $derived(data?.variation || 'default');

	const VariationComponent = $derived(getVariationComponent(variationName));

	const isEmpty = $derived(entries.length === 0);
</script>

<nav class="block toc" aria-label={ariaLabel}>
	{#if showTitle}
		<h2 class="toc-title">{data.title}</h2>
	{/if}

	{#if isEmpty}
		<p class="toc-empty">No headings found on this page.</p>
	{:else}
		<VariationComponent {entries} ordered={data?.ordered} sticky={data?.sticky} />
	{/if}
</nav>

<style>
	.block.toc {
		--toc-title-margin: 0 0 1rem 0;
		--toc-title-font-size: 1.25rem;
		--toc-title-font-weight: 600;
		--toc-empty-color: var(--color-text-muted, #666);

		scroll-behavior: smooth;
	}

	.toc-title {
		margin: var(--toc-title-margin);
		font-size: var(--toc-title-font-size);
		font-weight: var(--toc-title-font-weight);
		line-height: 1.3;
	}

	.toc-empty {
		color: var(--toc-empty-color);
		font-style: italic;
		margin: 0;
	}

	/* Responsive breakpoints */
	@media (min-width: 640px) {
		.block.toc {
			--toc-title-font-size: 1.375rem;
		}
	}

	@media (min-width: 1024px) {
		.block.toc {
			--toc-title-font-size: 1.5rem;
		}
	}
</style>
