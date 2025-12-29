<script>
	import { PUBLIC_FRONTEND_BASE_URL } from '$env/static/public';
	export let defaultScale = 'preview';
	export let onlyDefaultScale = false;
	export let fieldName = 'image';
	export let catalogItem;
	export let objectItem;

	function getImageConfigFromCatalogItem(item, fieldName) {
		if (!item.image_scales) {
			return {};
		}
		const imageConfig = item.image_scales.hasOwnProperty(fieldName)
			? item.image_scales[fieldName][0]
			: {};
		return imageConfig;
	}

	function getImageConfigFromObjectItem(item, fieldName) {
		// console.log(item)
		const imageConfig = item.hasOwnProperty(fieldName) ? item[fieldName] : {};
		// console.log(imageConfig)
		return imageConfig;
	}

	function generateSrcSet(imageConfig, basePath) {
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
			let srcEntry;
			srcEntry = `${PUBLIC_FRONTEND_BASE_URL}/renderimg${basePath}/${scales[s].download} ${scales[s].width}w`;
			srcSet = srcSet + srcEntry;
			// no download needed for objectItem ;) ^^
		}
		return srcSet;
	}

	let imageConfig = {};
	let basePath = '';
	if (catalogItem) {
		imageConfig = getImageConfigFromCatalogItem(catalogItem, fieldName);
		basePath = catalogItem['href'];
	} else if (objectItem) {
		imageConfig = getImageConfigFromObjectItem(objectItem, fieldName);
		basePath = objectItem['href'];
	}

	const scales = imageConfig.hasOwnProperty('scales') ? imageConfig.scales : {};

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
