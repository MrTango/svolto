<script lang="ts">
	import type { Component } from 'svelte';
	import DefaultBlockView from '$lib/blocks/DefaultBlockView.svelte';
	import { isAsyncBlock, getBlockComponent, type BlockConfig } from '$lib/blocks/index';
	import type { ListingResponse } from '$lib/blocks/listing/types';

	let {
		block,
		blockData,
		blockType,
		blockConfig,
		content,
		pathname,
		metadata = undefined,
		listingData = {} as Record<string, ListingResponse>,
		listingPages = {} as Record<string, number>,
		paginatedBlockCount = 1,
		blocksConfig = {}
	}: {
		block: string;
		blockData: Record<string, unknown>;
		blockType: string;
		blockConfig: BlockConfig | undefined;
		content: Record<string, unknown>;
		pathname: string;
		metadata?: Record<string, unknown>;
		listingData?: Record<string, ListingResponse>;
		listingPages?: Record<string, number>;
		paginatedBlockCount?: number;
		blocksConfig?: Record<string, BlockConfig>;
	} = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let LoadedComponent: Component<any> | null = $state(null);
	let loadError: Error | null = $state(null);
	let isLoading = $state(false);

	// Determine if this block uses async loading
	const needsAsyncLoad = $derived(blockConfig && isAsyncBlock(blockType));

	// For sync blocks, get the component directly
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const syncComponent = $derived<Component<any> | null>(
		!needsAsyncLoad && blockConfig ? (blockConfig.view as Component<any>) : null
	);

	// Load async block component when needed
	$effect(() => {
		if (!needsAsyncLoad || !blockType) {
			LoadedComponent = null;
			return;
		}

		isLoading = true;
		loadError = null;

		getBlockComponent(blockType)
			.then((component) => {
				LoadedComponent = component;
				isLoading = false;
			})
			.catch((error) => {
				console.error(`Failed to load block "${blockType}":`, error);
				loadError = error;
				isLoading = false;
			});
	});

	// The final component to render
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const BlockComponent = $derived<Component<any>>(
		syncComponent || LoadedComponent || DefaultBlockView
	);

	const showDefaultFallback = $derived(BlockComponent === DefaultBlockView && !isLoading);
</script>

<div class="VoltoBlock">
	{#if isLoading}
		<!-- Async block loading - show placeholder -->
		<div class="block-loading" aria-busy="true">
			<span class="sr-only">Loading block...</span>
		</div>
	{:else if loadError}
		<!-- Error loading async block - show error message in dev, default view in prod -->
		<p>block: {block} [{blockType}] - failed to load</p>
		<DefaultBlockView />
	{:else}
		{#if showDefaultFallback}
			<p>block: {block} [{blockType}]</p>
		{/if}
		<BlockComponent
			key={block}
			id={block}
			data={blockData}
			{metadata}
			properties={content}
			path={pathname}
			{blocksConfig}
			initialListingData={listingData[block]}
			page={listingPages[block] ?? 1}
			{listingData}
			{listingPages}
			{paginatedBlockCount}
		/>
	{/if}
</div>

<style>
	.block-loading {
		min-height: 50px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
