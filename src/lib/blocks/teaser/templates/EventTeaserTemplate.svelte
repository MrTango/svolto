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
		/** Target content data for event-specific fields */
		target: Record<string, unknown> | null;
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
		showDescription,
		target
	}: Props = $props();

	// Event-specific fields from target
	const startDate = $derived(target?.start as string | undefined);
	const endDate = $derived(target?.end as string | undefined);
	const wholeDay = $derived(target?.whole_day as boolean | undefined);
	const location = $derived(target?.location as string | undefined);

	// Format date using Intl.DateTimeFormat for locale-aware display
	function formatDate(dateString: string | undefined): string {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}).format(date);
		} catch {
			return '';
		}
	}

	// Format time using Intl.DateTimeFormat for locale-aware display
	function formatTime(dateString: string | undefined): string {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat(undefined, {
				hour: 'numeric',
				minute: '2-digit'
			}).format(date);
		} catch {
			return '';
		}
	}

	// Derive formatted values
	const formattedStartDate = $derived(formatDate(startDate));
	const formattedEndDate = $derived(formatDate(endDate));
	const formattedStartTime = $derived(formatTime(startDate));
	const formattedEndTime = $derived(formatTime(endDate));

	// Determine if we should show time (only when not a whole day event)
	const showTime = $derived(!wholeDay && (formattedStartTime || formattedEndTime));

	// Check if start and end are on the same day
	const isSameDay = $derived(() => {
		if (!startDate || !endDate) return true;
		const start = new Date(startDate);
		const end = new Date(endDate);
		return (
			start.getFullYear() === end.getFullYear() &&
			start.getMonth() === end.getMonth() &&
			start.getDate() === end.getDate()
		);
	});

	// Determine if location should be displayed
	const showLocation = $derived(location && location.trim().length > 0);
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

	<!-- Event-specific information -->
	<div class="event-info">
		{#if formattedStartDate}
			<div class="event-date">
				{#if isSameDay()}
					<span>{formattedStartDate}</span>
				{:else}
					<span>{formattedStartDate}</span>
					{#if formattedEndDate}
						<span class="date-separator"> - </span>
						<span>{formattedEndDate}</span>
					{/if}
				{/if}
			</div>
		{/if}

		{#if showTime}
			<div class="event-time">
				<span>{formattedStartTime}</span>
				{#if formattedEndTime}
					<span class="time-separator"> - </span>
					<span>{formattedEndTime}</span>
				{/if}
			</div>
		{/if}

		{#if showLocation}
			<div class="event-location">
				<span>{location}</span>
			</div>
		{/if}
	</div>

	{#if showDescription}
		<p class="description">{description}</p>
	{/if}
</div>

<style>
	.event-info {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		color: #666;
	}

	.event-date {
		font-weight: 500;
	}

	.event-time {
		margin-top: 0.25rem;
	}

	.event-location {
		margin-top: 0.25rem;
		font-style: italic;
	}

	.date-separator,
	.time-separator {
		color: #999;
	}
</style>
