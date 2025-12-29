<script lang="ts">
	import { getTemplateForContentType } from './templates/index';

	let { key, id, data, metadata, properties, path } = $props();

	// Extract target content from href
	const target = $derived(data?.href?.[0] || null);

	// Determine if content is customized or inherited from target
	const isOverwritten = $derived(data?.overwrite === true);

	// Get content values - use overwritten values if specified, otherwise from target
	const title = $derived(isOverwritten && data?.title ? data.title : target?.title || '');
	const description = $derived(
		isOverwritten && data?.description ? data.description : target?.description || ''
	);
	const headTitle = $derived(
		isOverwritten && data?.head_title ? data.head_title : target?.head_title || ''
	);

	// Determine if description should be shown
	const showDescription = $derived(!data?.hide_description && description);

	// Alignment - read from data.styles.align, default to 'left'
	const alignment = $derived(data?.styles?.align || 'left');

	// Get content type from target for template lookup
	const contentType = $derived(target?.['@type'] as string | undefined);

	// Get the appropriate template component based on content type
	const TemplateComponent = $derived(getTemplateForContentType(contentType));

	// Compute CSS classes dynamically for alignment (following SlateTableBlockView pattern)
	const blockClasses = $derived(() => {
		const classes = ['block', 'teaser'];
		classes.push(`has--align--${alignment}`);
		return classes.join(' ');
	});

	// Build the href path from the target @id
	const hrefPath = $derived(() => {
		if (!target?.['@id']) return '#';
		try {
			const url = new URL(target['@id']);
			return url.pathname.replace(/^\/Plone/, '') || '/';
		} catch {
			// If it's not a valid URL, try to extract path
			const id = target['@id'];
			const ploneIndex = id.indexOf('/Plone');
			if (ploneIndex !== -1) {
				return id.substring(ploneIndex + 6) || '/';
			}
			return id;
		}
	});

	// Image handling - check for image data from various sources
	const hasImage = $derived(() => {
		// Check for preview_image in data
		if (data?.preview_image) return true;
		// Check target's hasPreviewImage flag
		if (target?.hasPreviewImage) return true;
		// Check for image_field in target
		if (target?.image_field && target?.image_scales) {
			const imageField = target.image_field;
			return !!target.image_scales[imageField]?.[0];
		}
		return false;
	});

	// Get image data - prioritize data.preview_image, then target's image_scales
	const imageData = $derived(() => {
		// Check data.preview_image first (overwritten image)
		if (data?.preview_image?.[0]) {
			return data.preview_image[0];
		}
		// Check target's image_scales using image_field
		if (target?.image_scales && target?.image_field) {
			const imageField = target.image_field;
			const scales = target.image_scales[imageField];
			if (scales?.[0]) {
				return scales[0];
			}
		}
		return null;
	});

	// Build base URL for image paths
	// Use base_path from image data if available (for linked images),
	// otherwise fall back to target's @id pathname
	const imageBaseUrl = $derived(() => {
		const imgData = imageData();
		// Check if image has a base_path (e.g., linked preview images from different content)
		if (imgData?.base_path) {
			return '/Plone' + imgData.base_path;
		}
		// Fall back to target's @id pathname
		if (!target?.['@id']) return '';
		try {
			const url = new URL(target['@id']);
			return url.pathname;
		} catch {
			return target['@id'];
		}
	});

	// Get image scales for ResponsiveImage component
	const imageScales = $derived(() => {
		const imgData = imageData();
		return imgData?.scales || undefined;
	});

	// Build srcset from image scales (kept for backward compatibility)
	const srcset = $derived(() => {
		const imgData = imageData();
		if (!imgData?.scales) return '';

		const baseUrl = imageBaseUrl();
		const srcsetEntries: string[] = [];

		for (const [, value] of Object.entries(imgData.scales)) {
			const scaleValue = value as { download: string; width: number };
			srcsetEntries.push(`${baseUrl}/${scaleValue.download} ${scaleValue.width}w`);
		}

		return srcsetEntries.join(', ');
	});

	// Get the main image download URL for fallback src
	const imageSrc = $derived(() => {
		const imgData = imageData();
		if (!imgData?.download) return '';
		const baseUrl = imageBaseUrl();
		return `${baseUrl}/${imgData.download}`;
	});

	// Get alt text for image
	const imageAlt = $derived(() => {
		const imgData = imageData();
		return imgData?.alt || title || '';
	});

	// Get image dimensions for aspect ratio
	const imageWidth = $derived(() => {
		const imgData = imageData();
		return imgData?.width || 800;
	});

	const imageHeight = $derived(() => {
		const imgData = imageData();
		return imgData?.height || 600;
	});

	// Determine teaser-item modifier class based on content type (BEM modifier classes - Task 6.6)
	const teaserItemClass = $derived(() => {
		const classes = ['teaser-item'];

		// Add content-type modifier
		if (contentType === 'Event') {
			classes.push('event');
		} else {
			classes.push('default');
		}

		// Add no-image modifier when no image present (Task 6.5)
		if (!hasImage()) {
			classes.push('no-image');
		}

		return classes.join(' ');
	});
</script>

<div class={blockClasses()}>
	{#if target}
		<a href={hrefPath()} class={teaserItemClass()}>
			<TemplateComponent
				hasImage={hasImage()}
				scales={imageScales()}
				imageBaseUrl={imageBaseUrl()}
				srcset={srcset()}
				imageSrc={imageSrc()}
				imageAlt={imageAlt()}
				imageWidth={imageWidth()}
				imageHeight={imageHeight()}
				{headTitle}
				{title}
				{description}
				showDescription={!!showDescription}
				{target}
			/>
		</a>
	{/if}
</div>

<style>
	/* CSS Custom Properties (Volto-compatible) - Task 6.2 */
	.block.teaser {
		--teaser-images-aspect-ratio: 16/9;
		--teaser-images-object-position: top left;
	}

	/* Base teaser-item styling */
	.teaser-item {
		display: flex;
		text-decoration: none;
		color: inherit;
		gap: 1rem;
	}

	/* Left alignment: image on left, text on right (default) - Task 6.3 */
	.block.teaser.has--align--left .teaser-item {
		flex-direction: row;
	}

	/* Right alignment: image on right, text on left - Task 6.3 */
	.block.teaser.has--align--right .teaser-item {
		flex-direction: row-reverse;
	}

	/* Center/Top alignment: image above text (stacked) - Task 6.3 */
	.block.teaser.has--align--center .teaser-item {
		flex-direction: column;
	}

	/* Styles for child components need to be global since they're in separate components */
	.teaser-item :global(.image-wrapper) {
		flex-shrink: 0;
	}

	/* Adjust image-wrapper width for side-by-side layouts */
	.block.teaser.has--align--left .teaser-item :global(.image-wrapper),
	.block.teaser.has--align--right .teaser-item :global(.image-wrapper) {
		width: 50%;
		margin: 0;
	}

	/* Full width image for stacked/center layout */
	.block.teaser.has--align--center .teaser-item :global(.image-wrapper) {
		width: 100%;
		margin: 0;
	}

	/* Teaser image styling with CSS custom properties - Task 6.2 */
	.teaser-item :global(.teaser-image) {
		aspect-ratio: var(--teaser-images-aspect-ratio);
		object-fit: cover;
		object-position: var(--teaser-images-object-position);
		width: 100%;
		height: auto;
	}

	/* Content area styling */
	.teaser-item :global(.content) {
		flex: 1;
		min-width: 0;
		padding: 0.5rem 0;
	}

	/* Style teaser without image - Task 6.5 */
	.teaser-item.no-image :global(.content) {
		width: 100%;
		padding: 0.5rem 0;
	}

	/* BEM modifier classes for different teaser types - Task 6.6 */
	.teaser-item.default {
		/* Default teaser styling - can be customized */
	}

	.teaser-item.event {
		/* Event teaser styling - can be customized */
	}

	/* Mobile responsive behavior - Task 6.4 */
	@media (max-width: 768px) {
		/* Stack all alignments vertically on mobile */
		.block.teaser.has--align--left .teaser-item,
		.block.teaser.has--align--right .teaser-item {
			flex-direction: column;
		}

		/* Remove side margins on image wrapper when stacked */
		.block.teaser.has--align--left .teaser-item :global(.image-wrapper),
		.block.teaser.has--align--right .teaser-item :global(.image-wrapper) {
			width: 100%;
			margin: 0;
		}

		/* Image takes full width when stacked vertically */
		.teaser-item :global(.teaser-image) {
			width: 100%;
		}
	}
</style>
