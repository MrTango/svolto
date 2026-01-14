<!--
@deprecated This component is deprecated. Use ResponsiveImage instead.

Migration Guide:
================
Replace Picture.svelte with ResponsiveImage from '$lib/components/ResponsiveImage.svelte'.

Props mapping:
- catalogItem/objectItem -> Extract scales from image_scales and pass to `scales` prop
- catalogItem.href -> `baseUrl` prop
- fieldName -> Use to extract the correct field from image_scales
- defaultScale -> Not needed, ResponsiveImage uses all available scales

Example migration:
==================

Before (Picture.svelte):
```svelte
<Picture catalogItem={item} fieldName="image" />
```

After (ResponsiveImage):
```svelte
<script>
import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

// Extract image data from catalog item
const imageData = item.image_scales?.image?.[0];
const scales = imageData?.scales;
const baseUrl = item.href || '';
const src = imageData?.download ? `${baseUrl}/${imageData.download}` : '';
</script>

<ResponsiveImage
  {scales}
  {baseUrl}
  {src}
  alt=""
  width={imageData?.width}
  height={imageData?.height}
/>
```

ResponsiveImage benefits:
- No /renderimg route dependency (uses direct URLs)
- Supports fetchpriority prop for LCP optimization
- CSS aspect-ratio placeholder for CLS prevention
- Supports onload handler for fade-in transitions
-->
<script lang="ts">
	interface Scale {
		download: string;
		width: number;
		height?: number;
	}

	interface ImageConfig {
		scales?: Record<string, Scale>;
	}

	interface CatalogItem {
		href?: string;
		image_scales?: Record<string, ImageConfig[]>;
	}

	interface ObjectItem {
		href?: string;
		[key: string]: unknown;
	}

	export let defaultScale = 'preview';
	export let onlyDefaultScale = false;
	export let fieldName = 'image';
	export let catalogItem: CatalogItem | undefined = undefined;
	export let objectItem: ObjectItem | undefined = undefined;

	function getImageConfigFromCatalogItem(item: CatalogItem, fieldName: string): ImageConfig {
		if (!item.image_scales) {
			return {};
		}
		const imageConfig = item.image_scales.hasOwnProperty(fieldName)
			? item.image_scales[fieldName][0]
			: {};
		return imageConfig;
	}

	function getImageConfigFromObjectItem(item: ObjectItem, fieldName: string): ImageConfig {
		const imageConfig = item.hasOwnProperty(fieldName) ? (item[fieldName] as ImageConfig) : {};
		return imageConfig;
	}

	function generateSrcSet(imageConfig: ImageConfig, basePath: string): string {
		if (!imageConfig) {
			return '';
		}
		let srcSet = '';
		for (const s in scales) {
			if (onlyDefaultScale && s !== defaultScale) {
				continue;
			}
			if (srcSet) {
				srcSet = srcSet + ',';
			}
			let srcEntry: string;
			// Use direct paths instead of /renderimg route
			srcEntry = `${basePath}/${scales[s].download} ${scales[s].width}w`;
			srcSet = srcSet + srcEntry;
		}
		return srcSet;
	}

	let imageConfig: ImageConfig = {};
	let basePath = '';
	if (catalogItem) {
		imageConfig = getImageConfigFromCatalogItem(catalogItem, fieldName);
		basePath = catalogItem['href'] || '';
	} else if (objectItem) {
		imageConfig = getImageConfigFromObjectItem(objectItem, fieldName);
		basePath = objectItem['href'] || '';
	}

	const scales: Record<string, Scale> = imageConfig.hasOwnProperty('scales') && imageConfig.scales ? imageConfig.scales : {};

	const scale = scales.hasOwnProperty(defaultScale) ? scales[defaultScale] : scales['preview'];
	const srcset = generateSrcSet(imageConfig, basePath);
</script>

{#if srcset && scale}
	<picture>
		<source {srcset} />
		<img
			alt=""
			class=""
			loading="lazy"
			src="{basePath}/{scale.download}"
			width={scale.width}
			height={scale.height}
		/>
	</picture>
{/if}
