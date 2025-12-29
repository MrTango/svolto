<script lang="ts">
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	interface ScaleEntry {
		/** Download path for this scale */
		download: string;
		/** Width of this scale in pixels */
		width: number;
		/** Height of this scale in pixels (optional) */
		height?: number;
	}

	interface Props {
		/** Whether image is available */
		hasImage: boolean;
		/** Plone image scales data for ResponsiveImage component */
		scales?: Record<string, ScaleEntry>;
		/** Base URL for constructing image paths */
		imageBaseUrl?: string;
		/** Image srcset string (kept for backward compatibility) */
		srcset: string;
		/** Image src URL */
		imageSrc: string;
		/** Image alt text */
		imageAlt: string;
		/** Image width */
		imageWidth: number;
		/** Image height */
		imageHeight: number;
		/** Head title (kicker) */
		headTitle: string;
		/** Main title */
		title: string;
		/** Description text */
		description: string;
		/** Whether to show description */
		showDescription: boolean;
	}

	let {
		hasImage,
		scales,
		imageBaseUrl = '',
		srcset,
		imageSrc,
		imageAlt,
		imageWidth,
		imageHeight,
		headTitle,
		title,
		description,
		showDescription
	}: Props = $props();
</script>

{#if hasImage}
	<div class="image-wrapper">
		<ResponsiveImage
			{scales}
			baseUrl={imageBaseUrl}
			src={imageSrc}
			alt={imageAlt}
			width={imageWidth}
			height={imageHeight}
			sizes="(max-width: 768px) 100vw, 50vw"
			loading="lazy"
			class="teaser-image"
		/>
	</div>
{/if}
<div class="content">
	{#if headTitle}
		<span class="headline">{headTitle}</span>
	{/if}
	<h2>{title}</h2>
	{#if showDescription}
		<p class="description">{description}</p>
	{/if}
</div>
