<script lang="ts">
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
	import { lcpImageClaimed } from '$lib/stores/lcp-tracking';
	import { addPreloadHint } from '$lib/stores/preload-hints';
	import { browser } from '$app/environment';

	interface ScaleEntry {
		download: string;
		width: number;
		height?: number;
	}

	let { key, id, data, ...others } = $props();

	const image_data = $derived(data?.image_scales?.image?.[0] || null);

	function normalizeUrl(urlString: string): string {
		try {
			const url = new URL(urlString);
			return url.pathname;
		} catch {
			return urlString;
		}
	}

	const baseUrl = $derived(data?.url ? normalizeUrl(data.url) : '');

	const isLcpImage = $derived.by(() => {
		if (!image_data) return false;
		return lcpImageClaimed.claim();
	});

	const srcset = $derived.by(() => {
		if (!image_data?.scales) return '';
		const entries: string[] = [];
		for (const [, value] of Object.entries(image_data.scales as Record<string, ScaleEntry>)) {
			entries.push(`${baseUrl}/${value.download} ${value.width}w`);
		}
		return entries.join(', ');
	});

	$effect(() => {
		if (isLcpImage && image_data && !browser) {
			addPreloadHint(
				srcset,
				'100vw',
				`${baseUrl}/${image_data.download}`
			);
		}
	});
</script>

{#if image_data}
	<p class="block image">
		<ResponsiveImage
			scales={image_data.scales}
			{baseUrl}
			alt={data?.alt || ''}
			src={`${baseUrl}/${image_data.download}`}
			width={image_data.width}
			height={image_data.height}
			loading={isLcpImage ? 'eager' : 'lazy'}
			fetchpriority={isLcpImage ? 'high' : 'auto'}
			class="image-richtext picture-variant-large"
		/>
	</p>
{:else}
	<p class="block image">Image data not available</p>
{/if}
