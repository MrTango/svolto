<script lang="ts">
	/**
	 * ResponsiveImage component for rendering Plone images with srcset support.
	 * Consolidates image rendering logic from ImageBlockView and TeaserBlockView.
	 *
	 * Width and height props are required for CLS (Cumulative Layout Shift) prevention.
	 * These should always be set from Plone's image_scales data.
	 */

	interface ScaleEntry {
		download: string;
		width: number;
		height?: number;
	}

	interface Props {
		scales: Record<string, ScaleEntry> | undefined;
		baseUrl: string;
		alt: string;
		src?: string;
		sizes?: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchpriority?: 'high' | 'low' | 'auto';
		decoding?: 'async' | 'sync' | 'auto';
		class?: string;
		onload?: () => void;
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
		fetchpriority = 'auto',
		decoding = 'async',
		class: className,
		onload
	}: Props = $props();

	let loaded = $state(false);

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

	const containerStyle = $derived(() => {
		const styles: string[] = [];

		if (width && height) {
			styles.push(`--aspect-ratio: ${width} / ${height}`);
		}

		styles.push('--image-placeholder-bg: #e5e5e5');

		return styles.join('; ');
	});

	function handleLoad() {
		loaded = true;
		onload?.();
	}
</script>

<div
	class="responsive-image-container"
	class:loaded
	style={containerStyle()}
>
	<picture>
		<source srcset={srcset()} {sizes} />
		<img
			{src}
			{alt}
			{width}
			{height}
			{loading}
			{fetchpriority}
			{decoding}
			class={className}
			onload={handleLoad}
		/>
	</picture>
</div>

<style>
	.responsive-image-container {
		background-color: var(--image-placeholder-bg, #e5e5e5);
		aspect-ratio: var(--aspect-ratio);
	}

	.responsive-image-container.loaded {
		background-color: transparent;
	}

	.responsive-image-container picture {
		display: block;
	}

	.responsive-image-container img {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
