<script lang="ts">
	import type { ListingItem, LinkHrefItem, ImageScale } from '../types';
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	let {
		items = [],
		linkTitle,
		linkHref
	}: {
		items: ListingItem[];
		linkTitle?: string;
		linkHref?: LinkHrefItem[];
	} = $props();

	// Extract path from item @id (removes Plone prefix)
	function getItemPath(item: ListingItem): string {
		if (!item['@id']) return '#';
		try {
			const url = new URL(item['@id']);
			return url.pathname.replace(/^\/Plone/, '') || '/';
		} catch {
			const id = item['@id'];
			const ploneIndex = id.indexOf('/Plone');
			if (ploneIndex !== -1) {
				return id.substring(ploneIndex + 6) || '/';
			}
			return id;
		}
	}

	// Check if item has an image
	function hasImage(item: ListingItem): boolean {
		if (item.hasPreviewImage) return true;
		if (item.image_field && item.image_scales) {
			const imageField = item.image_field;
			return !!item.image_scales[imageField]?.[0];
		}
		return false;
	}

	// Get image data from item
	function getImageData(item: ListingItem) {
		if (!item.image_scales || !item.image_field) return null;
		const imageField = item.image_field;
		const scales = item.image_scales[imageField];
		if (scales?.[0]) {
			return scales[0];
		}
		return null;
	}

	// Get image scales for ResponsiveImage component
	function getImageScales(item: ListingItem): Record<string, ImageScale> | undefined {
		const imgData = getImageData(item);
		return imgData?.scales || undefined;
	}

	// Build base URL for image paths from item @id
	function getImageBaseUrl(item: ListingItem): string {
		if (!item['@id']) return '';
		try {
			const url = new URL(item['@id']);
			return url.pathname;
		} catch {
			return item['@id'];
		}
	}

	// Get the main image download URL for fallback src
	function getImageSrc(item: ListingItem): string {
		const imgData = getImageData(item);
		if (!imgData?.download) return '';
		const baseUrl = getImageBaseUrl(item);
		return `${baseUrl}/${imgData.download}`;
	}

	// Get alt text for image
	function getImageAlt(item: ListingItem): string {
		const imgData = getImageData(item);
		return imgData?.alt || item.title || '';
	}

	// Get image dimensions
	function getImageWidth(item: ListingItem): number {
		const imgData = getImageData(item);
		return imgData?.width || 400;
	}

	function getImageHeight(item: ListingItem): number {
		const imgData = getImageData(item);
		return imgData?.height || 300;
	}

	// Extract path from linkHref
	const linkMorePath = $derived(() => {
		if (!linkHref?.[0]?.['@id']) return null;
		try {
			const url = new URL(linkHref[0]['@id']);
			return url.pathname.replace(/^\/Plone/, '') || '/';
		} catch {
			const id = linkHref[0]['@id'];
			const ploneIndex = id.indexOf('/Plone');
			if (ploneIndex !== -1) {
				return id.substring(ploneIndex + 6) || '/';
			}
			return id;
		}
	});

	// Determine if "Link More" should be shown
	const showLinkMore = $derived(!!linkTitle && !!linkMorePath());
</script>

<div class="listing-summary">
	{#if items.length > 0}
		<div class="listing-summary-grid">
			{#each items as item}
				{@const itemHasImage = hasImage(item)}
				<article class="listing-card {itemHasImage ? '' : 'no-image'}">
					{#if itemHasImage}
						<div class="card-image-wrapper">
							<a href={getItemPath(item)} class="card-image-link" tabindex="-1" aria-hidden="true">
								<ResponsiveImage
									scales={getImageScales(item)}
									baseUrl={getImageBaseUrl(item)}
									src={getImageSrc(item)}
									alt={getImageAlt(item)}
									width={getImageWidth(item)}
									height={getImageHeight(item)}
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									loading="lazy"
									class="card-image"
								/>
							</a>
						</div>
					{/if}
					<div class="card-content">
						<h3 class="card-title">
							<a href={getItemPath(item)}>{item.title}</a>
						</h3>
						{#if item.description}
							<p class="card-description">{item.description}</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}

	{#if showLinkMore}
		<div class="listing-footer">
			<a href={linkMorePath()} class="link-more">{linkTitle}</a>
		</div>
	{/if}
</div>

<style>
	/* CSS Custom Properties for theming */
	.listing-summary {
		--listing-card-gap: 1.5rem;
		--listing-card-aspect-ratio: 16/9;
		--listing-card-border-radius: 8px;
		--listing-card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		--listing-card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
		--listing-card-bg: white;
		--listing-link-color: inherit;
		--listing-link-hover-color: var(--color-primary, #0066cc);
	}

	/* Responsive grid layout */
	.listing-summary-grid {
		display: grid;
		gap: var(--listing-card-gap);
		/* Mobile: 1 column */
		grid-template-columns: 1fr;
	}

	/* Tablet: 2 columns */
	@media (min-width: 640px) {
		.listing-summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Desktop: 3 columns */
	@media (min-width: 1024px) {
		.listing-summary-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Card styling */
	.listing-card {
		display: flex;
		flex-direction: column;
		background: var(--listing-card-bg);
		border-radius: var(--listing-card-border-radius);
		box-shadow: var(--listing-card-shadow);
		overflow: hidden;
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.listing-card:hover {
		box-shadow: var(--listing-card-shadow-hover);
		transform: translateY(-2px);
	}

	/* Image wrapper */
	.card-image-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.card-image-link {
		display: block;
		width: 100%;
	}

	/* Image styling with aspect ratio */
	.card-image-wrapper :global(.card-image) {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: var(--listing-card-aspect-ratio);
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.listing-card:hover .card-image-wrapper :global(.card-image) {
		transform: scale(1.05);
	}

	/* Content area */
	.card-content {
		flex: 1;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	/* Title styling */
	.card-title {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.card-title a {
		color: var(--listing-link-color);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.card-title a:hover {
		color: var(--listing-link-hover-color);
	}

	/* Description styling with line clamping */
	.card-description {
		margin: 0;
		color: var(--color-text-muted, #666);
		font-size: 0.875rem;
		line-height: 1.5;
		/* Limit to 3 lines with cross-browser support */
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Cards without images - add extra top padding */
	.listing-card.no-image .card-content {
		padding-top: 1.25rem;
	}

	/* Footer / Link More styling (reused from DefaultVariation) */
	.listing-footer {
		margin-top: 2rem;
		text-align: center;
	}

	.link-more {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary, #0066cc);
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.link-more:hover {
		background-color: var(--color-primary-dark, #0052a3);
	}
</style>
