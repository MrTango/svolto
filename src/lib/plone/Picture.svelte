<script lang="ts">
	import { PUBLIC_FRONTEND_BASE_URL } from '$env/static/public';

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
			srcEntry = `${PUBLIC_FRONTEND_BASE_URL}/renderimg${basePath}/${scales[s].download} ${scales[s].width}w`;
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
			src="{PUBLIC_FRONTEND_BASE_URL}/renderimg{basePath}/{scale.download}"
			width={scale.width}
			height={scale.height}
		/>
	</picture>
{/if}
