<script>
	import Picture from '$lib/plone/Picture.svelte';
	export let item = {};
	const defaultScale = 'preview';

	// function getImageConfig(item, fieldName) {
	// 	if (!item.image_scales) {
	// 		return;
	// 	}
	// 	const imageConfig = item.image_scales.hasOwnProperty(fieldName)
	// 		? item.image_scales[fieldName][0]
	// 		: null;
	// 	return imageConfig;
	// }

	// const leadImage = getImageConfig(item, 'image');
</script>

<div class="listingItem">
	<div class="textWrapper">
		<h2><a href={item.href}>{item.title}</a></h2>
		<p>{item.description}</p>
	</div>
	<div class="imageWrapper">
		<!-- {#if leadImage} -->
		<Picture catalogItem={item} {defaultScale} />
		<!-- {/if} -->
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
		// flex-shrink: 2;
		// flex-grow: 1;
		padding-right: 1em;
	}
	.imageWrapper {
		width: 400px;
		flex-shrink: 0;
	}
</style>
