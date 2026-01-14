<script lang="ts">
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import blocks from '$lib/blocks';
	import Breadcrumbs from '$lib/plone/breadcrumbs.svelte';
	import { LanguageSwitcher, SiteFooter, SiteHeader } from '$lib/components';
	import { preloadHints } from '$lib/stores/preload-hints';
	import { lcpImageClaimed } from '$lib/stores/lcp-tracking';
	import config from '@plone/registry';
	import '../app.css';

	config.blocks.blocksConfig = {
		...config.blocks.blocksConfig,
		...blocks
	};

	let { data, children } = $props();

	let currentPath = $derived('/' + ($page.params.path || ''));

	let isMultilingual = $derived(
		(data.siteSettings?.availableLanguages?.length ?? 0) > 1
	);

	beforeNavigate(() => {
		preloadHints.reset();
		lcpImageClaimed.reset();
	});
</script>

<svelte:head>
	{#each $preloadHints as hint (hint.src)}
		<link
			rel="preload"
			as="image"
			href={hint.src}
			imagesrcset={hint.srcset}
			imagesizes={hint.sizes}
		/>
	{/each}
</svelte:head>

<div class="site-wrapper">
	<SiteHeader navigation={data.navigation?.items ?? []} {currentPath}>
		{#snippet utility()}
			{#if isMultilingual}
				<LanguageSwitcher
					availableLanguages={data.siteSettings?.availableLanguages ?? []}
					currentLang={data.currentLang ?? 'en'}
					translations={data.translations ?? []}
				/>
			{/if}
		{/snippet}
	</SiteHeader>

	{#if data.breadcrumbs && data.breadcrumbs.length > 0}
		<div class="breadcrumbs-wrapper">
			<nav class="container-default" aria-label="Breadcrumb">
				<Breadcrumbs breadcrumbs={data.breadcrumbs} />
			</nav>
		</div>
	{/if}

	<main class="main-content container-default">
		{@render children?.()}
	</main>

	<SiteFooter />
</div>
