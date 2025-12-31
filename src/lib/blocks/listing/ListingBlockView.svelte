<script lang="ts">
	import { browser } from '$app/environment';
	import type { ListingBlockData, ListingItem, ListingResponse } from './types';
	import { getVariationComponent } from './variations/index';
	import {
		fetchListingData,
		calculateBStart,
		calculateTotalPages,
		DEFAULT_BATCH_SIZE
	} from './api';
	import Pagination from '$lib/components/Pagination.svelte';

	let {
		key,
		id,
		data,
		metadata,
		properties,
		path,
		page = 1,
		initialListingData = undefined,
		paginatedBlockCount = 1
	}: {
		key: string;
		id: string;
		data: ListingBlockData;
		metadata?: Record<string, unknown>;
		properties?: Record<string, unknown>;
		path?: string;
		page?: number;
		initialListingData?: ListingResponse;
		/** Number of paginated blocks on the page (determines pagination key format) */
		paginatedBlockCount?: number;
	} = $props();

	// Derive SSR data reactively - updates when initialListingData prop changes (on navigation)
	const ssrItems = $derived(initialListingData?.items ?? []);
	const ssrTotal = $derived(initialListingData?.total ?? 0);

	// Client-side fetched data (only used when no SSR data available)
	let clientItems: ListingItem[] | null = $state(null);
	let clientTotal: number | null = $state(null);

	// Use SSR data if available, otherwise client data
	const items = $derived(clientItems ?? ssrItems);
	const total = $derived(clientTotal ?? ssrTotal);

	// Get batch size from data or use default (defined here as it's needed for displayItems)
	const batchSize = $derived(data?.b_size || data?.querystring?.b_size || DEFAULT_BATCH_SIZE);

	// Ensure displayed items respect batch size for current page
	// This guards against SSR/client data mismatch or stale data
	const displayItems = $derived(items.slice(0, batchSize));

	// Loading state - not loading if we have SSR data
	let isLoading = $state(!initialListingData);

	// Calculate total pages for pagination
	const totalPages = $derived(calculateTotalPages(total, batchSize));

	// Determine if headline should be displayed
	const showHeadline = $derived(!!data?.headline);

	// Get the headline tag (h2 or h3, default to h2)
	const headlineTag = $derived(data?.headlineTag || 'h2');

	// Get the variation name (default to 'default')
	const variationName = $derived(data?.variation || 'default');

	// Get the appropriate variation component
	const VariationComponent = $derived(getVariationComponent(variationName));

	// Check if results are empty (after loading)
	const isEmpty = $derived(!isLoading && displayItems.length === 0);

	// Check if pagination should be shown
	const showPagination = $derived(!isLoading && totalPages > 1);

	// CSS classes for the block container
	const blockClasses = $derived(() => {
		const classes = ['block', 'listing'];
		classes.push(`variation-${variationName}`);
		if (isLoading) {
			classes.push('is-loading');
		}
		return classes.join(' ');
	});

	// Client-side data fetching - only runs when no SSR data is available
	$effect(() => {
		// Only run on client
		if (!browser) return;

		// Skip if we have SSR data - trust the server-rendered content
		if (initialListingData) {
			isLoading = false;
			return;
		}

		// No SSR data - fetch on client
		const currentPage = page;
		const querystring = data?.querystring;
		const currentBatchSize = batchSize;

		async function loadData() {
			isLoading = true;

			try {
				const b_start = calculateBStart(currentPage, currentBatchSize);
				const response = await fetchListingData(querystring, b_start, currentBatchSize);

				clientItems = response.items;
				clientTotal = response.total;
			} catch (error) {
				console.error('Failed to load listing data:', error);
				clientItems = [];
				clientTotal = 0;
			} finally {
				isLoading = false;
			}
		}

		loadData();
	});
</script>

<div class={blockClasses()}>
	{#if showHeadline}
		{#if headlineTag === 'h3'}
			<h3 class="headline">{data.headline}</h3>
		{:else}
			<h2 class="headline">{data.headline}</h2>
		{/if}
	{/if}

	{#if isLoading}
		<div class="listing-loading">
			<div class="loading-spinner"></div>
			<span class="loading-text">Loading...</span>
		</div>
	{:else if isEmpty}
		<div class="listing-empty">
			<p class="empty-message">No results found.</p>
		</div>
	{:else}
		<VariationComponent items={displayItems} linkTitle={data?.linkTitle} linkHref={data?.linkHref} />

		{#if showPagination}
			<Pagination
				currentPage={page}
				{totalPages}
				baseUrl={path || '/'}
				blockId={key}
				{paginatedBlockCount}
			/>
		{/if}
	{/if}
</div>

<style>
	/* CSS Custom Properties for theming consistency */
	.block.listing {
		/* Spacing */
		--listing-headline-margin: 0 0 1rem 0;
		--listing-loading-min-height: 200px;
		--listing-empty-padding: 2rem;
		--listing-content-gap: 1.5rem;

		/* Colors (use CSS custom properties for theming) */
		--listing-text-color: var(--color-text, #333);
		--listing-text-muted: var(--color-text-muted, #666);
		--listing-border-color: var(--color-border, #e5e5e5);
		--listing-primary-color: var(--color-primary, #0066cc);

		/* Typography */
		--listing-headline-font-size: 1.5rem;
		--listing-headline-font-weight: 600;
		--listing-body-font-size: 1rem;
		--listing-body-line-height: 1.5;
	}

	/* Block container - mobile-first responsive styles */
	.block.listing {
		width: 100%;
		font-size: var(--listing-body-font-size);
		line-height: var(--listing-body-line-height);
		color: var(--listing-text-color);
	}

	/* Headline styling (following GridBlockView pattern) */
	.headline {
		margin: var(--listing-headline-margin);
		width: 100%;
		font-size: var(--listing-headline-font-size);
		font-weight: var(--listing-headline-font-weight);
		line-height: 1.3;
	}

	/* Loading state */
	.listing-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: var(--listing-loading-min-height);
		gap: 1rem;
		padding: 2rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--listing-border-color);
		border-top-color: var(--listing-primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		color: var(--listing-text-muted);
		font-size: 0.875rem;
	}

	/* Empty state */
	.listing-empty {
		padding: var(--listing-empty-padding);
		text-align: center;
		background-color: var(--color-surface-muted, #f9f9f9);
		border-radius: 4px;
	}

	.empty-message {
		color: var(--listing-text-muted);
		margin: 0;
		font-style: italic;
	}

	/* Responsive breakpoints - mobile-first */

	/* Tablet (640px and up) */
	@media (min-width: 640px) {
		.block.listing {
			--listing-headline-font-size: 1.75rem;
		}

		.listing-loading {
			min-height: 250px;
		}
	}

	/* Desktop (1024px and up) */
	@media (min-width: 1024px) {
		.block.listing {
			--listing-headline-font-size: 2rem;
			--listing-content-gap: 2rem;
		}

		.listing-loading {
			min-height: 300px;
		}
	}
</style>
