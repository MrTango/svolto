<script lang="ts">
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	let { key, id, data, ...others } = $props();

	// Extract image data from Plone's image_scales structure
	const image_data = $derived(data?.image_scales?.image?.[0] || null);

	// Normalize URL to use pathname only (strip internal hostname like backend:8080)
	function normalizeUrl(urlString: string): string {
		try {
			const url = new URL(urlString);
			return url.pathname;
		} catch {
			return urlString;
		}
	}

	const baseUrl = $derived(data?.url ? normalizeUrl(data.url) : '');
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
			class="image-richtext picture-variant-large"
		/>
	</p>
{:else}
	<p class="block image">Image data not available</p>
{/if}
