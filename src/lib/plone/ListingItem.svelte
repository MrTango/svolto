<script lang="ts">
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	interface ImageScale {
		download: string;
		width: number;
		height?: number;
	}

	interface ImageData {
		download?: string;
		width?: number;
		height?: number;
		scales?: Record<string, ImageScale>;
		alt?: string;
	}

	interface ListingItemData {
		href?: string;
		title?: string;
		description?: string;
		image_field?: string;
		image_scales?: Record<string, ImageData[]>;
	}

	export let item: ListingItemData = {};
	const defaultFieldName = 'image';

	function getImageData(itemData: ListingItemData): ImageData | null {
		if (!itemData.image_scales) return null;
		const fieldName = itemData.image_field || defaultFieldName;
		const fieldData = itemData.image_scales[fieldName];
		if (fieldData?.[0]) {
			return fieldData[0];
		}
		return null;
	}

	function getImageScales(itemData: ListingItemData): Record<string, ImageScale> | undefined {
		const imgData = getImageData(itemData);
		return imgData?.scales;
	}

	function getImageBaseUrl(itemData: ListingItemData): string {
		return itemData.href || '';
	}

	function getImageSrc(itemData: ListingItemData): string {
		const imgData = getImageData(itemData);
		if (!imgData?.download) return '';
		const baseUrl = getImageBaseUrl(itemData);
		return `${baseUrl}/${imgData.download}`;
	}

	function getImageAlt(itemData: ListingItemData): string {
		const imgData = getImageData(itemData);
		return imgData?.alt || itemData.title || '';
	}

	function getImageWidth(itemData: ListingItemData): number | undefined {
		const imgData = getImageData(itemData);
		return imgData?.width;
	}

	function getImageHeight(itemData: ListingItemData): number | undefined {
		const imgData = getImageData(itemData);
		return imgData?.height;
	}

	const scales = getImageScales(item);
	const baseUrl = getImageBaseUrl(item);
	const src = getImageSrc(item);
	const alt = getImageAlt(item);
	const width = getImageWidth(item);
	const height = getImageHeight(item);
</script>

<div class="listingItem">
	<div class="textWrapper">
		<h2><a href={item.href}>{item.title}</a></h2>
		<p>{item.description}</p>
	</div>
	<div class="imageWrapper">
		{#if scales}
			<ResponsiveImage
				{scales}
				{baseUrl}
				{alt}
				{src}
				{width}
				{height}
				sizes="(max-width: 768px) 100vw, 400px"
			/>
		{/if}
	</div>
</div>

<style lang="scss">
	.listingItem {
		display: flex;
		flex-wrap: wrap;

		a {
			text-decoration: none;
		}
	}
	.textWrapper {
		flex: 1 2 300px;
		padding-right: 1em;
	}
	.imageWrapper {
		width: 400px;
		flex-shrink: 0;
	}
</style>
