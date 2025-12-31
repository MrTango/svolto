<script lang="ts">
	import type { ListingItem, LinkHrefItem, ImageScale } from '../types';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType } from 'embla-carousel';

	let {
		items = [],
		linkTitle,
		linkHref
	}: {
		items: ListingItem[];
		linkTitle?: string;
		linkHref?: LinkHrefItem[];
	} = $props();

	// Filter items to only include Image content types
	const imageItems = $derived(items.filter((item) => item['@type'] === 'Image'));

	// State for carousel
	let emblaApi: EmblaCarouselType | undefined = $state(undefined);
	let selectedIndex = $state(0);
	let canScrollPrev = $state(false);
	let canScrollNext = $state(false);

	// Fullscreen state
	let isFullscreen = $state(false);
	let galleryContainer: HTMLElement | undefined = $state(undefined);

	// Carousel config with options and plugins
	const emblaConfig = {
		options: { loop: true, align: 'center' as const },
		plugins: []
	};

	// Handle embla init
	function onEmblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		updateNavState();

		emblaApi.on('select', () => {
			selectedIndex = emblaApi?.selectedScrollSnap() ?? 0;
			updateNavState();
		});

		emblaApi.on('reInit', updateNavState);
	}

	function updateNavState() {
		if (!emblaApi) return;
		canScrollPrev = emblaApi.canScrollPrev();
		canScrollNext = emblaApi.canScrollNext();
	}

	// Navigation functions
	function scrollPrev() {
		emblaApi?.scrollPrev();
	}

	function scrollNext() {
		emblaApi?.scrollNext();
	}

	function scrollTo(index: number) {
		emblaApi?.scrollTo(index);
	}

	// Fullscreen functions
	function toggleFullscreen() {
		if (!galleryContainer) return;

		if (!isFullscreen) {
			if (galleryContainer.requestFullscreen) {
				galleryContainer.requestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	}

	// Handle fullscreen change events
	$effect(() => {
		function handleFullscreenChange() {
			isFullscreen = !!document.fullscreenElement;
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});

	// Handle escape key in fullscreen
	$effect(() => {
		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape' && isFullscreen) {
				toggleFullscreen();
			} else if (event.key === 'ArrowLeft') {
				scrollPrev();
			} else if (event.key === 'ArrowRight') {
				scrollNext();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	// Image utilities
	function getImageData(item: ListingItem) {
		if (!item.image_scales || !item.image_field) return null;
		const imageField = item.image_field;
		const scales = item.image_scales[imageField];
		if (scales?.[0]) {
			return scales[0];
		}
		return null;
	}

	function getImageScales(item: ListingItem): Record<string, ImageScale> | undefined {
		const imgData = getImageData(item);
		return imgData?.scales || undefined;
	}

	function getImageBaseUrl(item: ListingItem): string {
		if (!item['@id']) return '';
		try {
			const url = new URL(item['@id']);
			return url.pathname;
		} catch {
			return item['@id'];
		}
	}

	function getImageSrc(item: ListingItem): string {
		const imgData = getImageData(item);
		if (!imgData?.download) return '';
		const baseUrl = getImageBaseUrl(item);
		return `${baseUrl}/${imgData.download}`;
	}

	function getThumbnailSrc(item: ListingItem): string {
		const imgData = getImageData(item);
		if (!imgData?.scales) return getImageSrc(item);

		// Try to get thumbnail or mini scale for thumbnails
		const scales = imgData.scales;
		if (scales.thumb) {
			return `${getImageBaseUrl(item)}/${scales.thumb.download}`;
		}
		if (scales.mini) {
			return `${getImageBaseUrl(item)}/${scales.mini.download}`;
		}
		// Fallback to main image
		return getImageSrc(item);
	}

	function getImageAlt(item: ListingItem): string {
		const imgData = getImageData(item);
		return imgData?.alt || item.title || '';
	}

	function getImageWidth(item: ListingItem): number {
		const imgData = getImageData(item);
		return imgData?.width || 800;
	}

	function getImageHeight(item: ListingItem): number {
		const imgData = getImageData(item);
		return imgData?.height || 600;
	}
</script>

<div class="listing-gallery" class:fullscreen={isFullscreen} bind:this={galleryContainer}>
	{#if imageItems.length === 0}
		<div class="gallery-empty">
			<p>No images available in this gallery.</p>
		</div>
	{:else}
		<!-- Main carousel -->
		<div class="gallery-main">
			<div class="gallery-viewport" use:emblaCarouselSvelte={emblaConfig} onemblaInit={onEmblaInit}>
				<div class="gallery-container">
					{#each imageItems as item, index (item['@id'])}
						<div class="gallery-slide" class:is-selected={index === selectedIndex}>
							<img
								src={getImageSrc(item)}
								alt={getImageAlt(item)}
								width={getImageWidth(item)}
								height={getImageHeight(item)}
								loading={index === 0 ? 'eager' : 'lazy'}
								class="gallery-image"
							/>
							{#if item.title || item.description}
								<div class="gallery-caption">
									{#if item.title}
										<h3 class="gallery-caption-title">{item.title}</h3>
									{/if}
									{#if item.description}
										<p class="gallery-caption-description">{item.description}</p>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Navigation buttons -->
			<button
				type="button"
				class="gallery-nav gallery-nav-prev"
				onclick={scrollPrev}
				disabled={!canScrollPrev}
				aria-label="Previous image"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>
			<button
				type="button"
				class="gallery-nav gallery-nav-next"
				onclick={scrollNext}
				disabled={!canScrollNext}
				aria-label="Next image"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>

			<!-- Fullscreen button -->
			<button
				type="button"
				class="gallery-fullscreen-btn"
				onclick={toggleFullscreen}
				aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
			>
				{#if isFullscreen}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
						></path>
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
						></path>
					</svg>
				{/if}
			</button>

			<!-- Slide counter -->
			<div class="gallery-counter">
				{selectedIndex + 1} / {imageItems.length}
			</div>
		</div>

		<!-- Thumbnail navigation -->
		<div class="gallery-thumbnails">
			{#each imageItems as item, index (item['@id'])}
				<button
					type="button"
					class="gallery-thumbnail"
					class:is-selected={index === selectedIndex}
					onclick={() => scrollTo(index)}
					aria-label="Go to image {index + 1}: {item.title || ''}"
					aria-current={index === selectedIndex ? 'true' : undefined}
				>
					<img src={getThumbnailSrc(item)} alt="" loading="lazy" class="thumbnail-image" />
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* CSS Custom Properties for theming */
	.listing-gallery {
		--gallery-bg: #000;
		--gallery-text: #fff;
		--gallery-caption-bg: rgba(0, 0, 0, 0.7);
		--gallery-nav-bg: rgba(0, 0, 0, 0.5);
		--gallery-nav-hover-bg: rgba(0, 0, 0, 0.8);
		--gallery-nav-size: 48px;
		--gallery-thumbnail-size: 80px;
		--gallery-thumbnail-gap: 8px;
		--gallery-border-radius: 4px;
		--gallery-aspect-ratio: 16/9;
	}

	.listing-gallery {
		position: relative;
		background: var(--gallery-bg);
		border-radius: var(--gallery-border-radius);
		overflow: hidden;
	}

	/* Fullscreen mode */
	.listing-gallery.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		border-radius: 0;
	}

	.listing-gallery.fullscreen .gallery-main {
		height: calc(100vh - 100px);
	}

	.listing-gallery.fullscreen .gallery-thumbnails {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px;
		background: var(--gallery-caption-bg);
	}

	/* Empty state */
	.gallery-empty {
		padding: 3rem;
		text-align: center;
		color: var(--color-text-muted, #666);
		background: var(--color-bg-muted, #f5f5f5);
		border-radius: var(--gallery-border-radius);
	}

	.gallery-empty p {
		margin: 0;
		font-style: italic;
	}

	/* Main gallery area */
	.gallery-main {
		position: relative;
		aspect-ratio: var(--gallery-aspect-ratio);
		background: var(--gallery-bg);
	}

	/* Embla carousel viewport */
	.gallery-viewport {
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	/* Embla carousel container */
	.gallery-container {
		display: flex;
		height: 100%;
	}

	/* Gallery slides */
	.gallery-slide {
		position: relative;
		flex: 0 0 100%;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gallery-image {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}

	/* Caption overlay */
	.gallery-caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem 1.5rem;
		background: var(--gallery-caption-bg);
		color: var(--gallery-text);
	}

	.gallery-caption-title {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.gallery-caption-description {
		margin: 0;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	/* Navigation buttons */
	.gallery-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: var(--gallery-nav-size);
		height: var(--gallery-nav-size);
		background: var(--gallery-nav-bg);
		color: var(--gallery-text);
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 0.2s ease,
			opacity 0.2s ease;
		z-index: 10;
	}

	.gallery-nav:hover:not(:disabled) {
		background: var(--gallery-nav-hover-bg);
	}

	.gallery-nav:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.gallery-nav svg {
		width: 24px;
		height: 24px;
	}

	.gallery-nav-prev {
		left: 1rem;
	}

	.gallery-nav-next {
		right: 1rem;
	}

	/* Fullscreen button */
	.gallery-fullscreen-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 40px;
		height: 40px;
		background: var(--gallery-nav-bg);
		color: var(--gallery-text);
		border: none;
		border-radius: var(--gallery-border-radius);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
		z-index: 10;
	}

	.gallery-fullscreen-btn:hover {
		background: var(--gallery-nav-hover-bg);
	}

	.gallery-fullscreen-btn svg {
		width: 20px;
		height: 20px;
	}

	/* Slide counter */
	.gallery-counter {
		position: absolute;
		top: 1rem;
		left: 1rem;
		padding: 0.5rem 0.75rem;
		background: var(--gallery-nav-bg);
		color: var(--gallery-text);
		font-size: 0.875rem;
		border-radius: var(--gallery-border-radius);
		z-index: 10;
	}

	/* Thumbnail navigation */
	.gallery-thumbnails {
		display: flex;
		gap: var(--gallery-thumbnail-gap);
		padding: 0.75rem;
		background: var(--gallery-bg);
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
	}

	.gallery-thumbnails::-webkit-scrollbar {
		height: 6px;
	}

	.gallery-thumbnails::-webkit-scrollbar-track {
		background: transparent;
	}

	.gallery-thumbnails::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}

	.gallery-thumbnail {
		flex-shrink: 0;
		width: var(--gallery-thumbnail-size);
		height: var(--gallery-thumbnail-size);
		padding: 0;
		border: 2px solid transparent;
		border-radius: var(--gallery-border-radius);
		cursor: pointer;
		overflow: hidden;
		opacity: 0.6;
		transition:
			opacity 0.2s ease,
			border-color 0.2s ease;
		background: transparent;
	}

	.gallery-thumbnail:hover {
		opacity: 0.9;
	}

	.gallery-thumbnail.is-selected {
		opacity: 1;
		border-color: var(--gallery-text);
	}

	.thumbnail-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.listing-gallery {
			--gallery-nav-size: 40px;
			--gallery-thumbnail-size: 60px;
		}

		.gallery-nav svg {
			width: 20px;
			height: 20px;
		}

		.gallery-caption {
			padding: 0.75rem 1rem;
		}

		.gallery-caption-title {
			font-size: 0.875rem;
		}

		.gallery-caption-description {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.gallery-nav {
			display: none;
		}

		.gallery-thumbnails {
			justify-content: center;
		}
	}
</style>
