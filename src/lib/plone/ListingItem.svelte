<script lang="ts">
	import Picture from '$lib/plone/Picture.svelte';

	interface ListingItemData {
		href?: string;
		title?: string;
		description?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		image_scales?: Record<string, any>;
	}

	export let item: ListingItemData = {};
	const defaultScale = 'preview';
</script>

<div class="listingItem">
	<div class="textWrapper">
		<h2><a href={item.href}>{item.title}</a></h2>
		<p>{item.description}</p>
	</div>
	<div class="imageWrapper">
		<Picture catalogItem={item} {defaultScale} />
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
