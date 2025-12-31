<script lang="ts">
	/**
	 * ResponsiveImage component for rendering Plone images with srcset support.
	 * Consolidates image rendering logic from ImageBlockView and TeaserBlockView.
	 */

	interface ScaleEntry {
		/** Download path for this scale */
		download: string;
		/** Width of this scale in pixels */
		width: number;
		/** Height of this scale in pixels (optional) */
		height?: number;
	}

	interface Props {
		/** Plone image_scales data containing available image sizes */
		scales: Record<string, ScaleEntry> | undefined;
		/** Base URL for constructing full image paths */
		baseUrl: string;
		/** Alt text for accessibility (required for screen readers) */
		alt: string;
		/** Direct src URL for the img element fallback */
		src?: string;
		/** Responsive sizing hints for browser optimization */
		sizes?: string;
		/** Image width for CLS prevention */
		width?: number;
		/** Image height for CLS prevention */
		height?: number;
		/** Loading strategy: 'lazy' (default) or 'eager' */
		loading?: 'lazy' | 'eager';
		/** Custom CSS class for the img element */
		class?: string;
	}

	let {
		scales,
		baseUrl,
		alt,
		src = '',
		sizes = '100vw',
		width,
		height,
		loading = 'lazy',
		class: className
	}: Props = $props();

	/**
	 * Generates srcset string from Plone image_scales data.
	 * Format: "{baseUrl}/{download} {width}w, ..."
	 */
	const srcset = $derived(() => {
		if (!scales || Object.keys(scales).length === 0) {
			return '';
		}

		const srcsetEntries: string[] = [];

		for (const [, value] of Object.entries(scales)) {
			const scaleValue = value as ScaleEntry;
			srcsetEntries.push(`${baseUrl}/${scaleValue.download} ${scaleValue.width}w`);
		}

		return srcsetEntries.join(', ');
	});
</script>

<picture>
	<source srcset={srcset()} {sizes} />
	<img {src} {alt} {width} {height} {loading} class={className} />
</picture>
