<script lang="ts">
	import {
		detectVideoSource,
		extractYouTubeId,
		extractVimeoId,
		buildYouTubeEmbedUrl,
		buildVimeoEmbedUrl
	} from './utils';

	let { key, id, data, metadata, properties, path, blocksConfig } = $props();

	const videoSource = $derived(detectVideoSource(data?.url || ''));

	const embedUrl = $derived(() => {
		if (!data?.url) return null;

		if (videoSource === 'youtube') {
			const videoId = extractYouTubeId(data.url);
			return videoId ? buildYouTubeEmbedUrl(videoId) : null;
		}

		if (videoSource === 'vimeo') {
			const videoId = extractVimeoId(data.url);
			return videoId ? buildVimeoEmbedUrl(videoId) : null;
		}

		return null;
	});

	const videoSrc = $derived(videoSource === 'self-hosted' ? data?.url : null);

	const posterImage = $derived(data?.preview_image || null);

	// Alignment - read from data.styles.align or data.align, default to 'full'
	const alignment = $derived(data?.styles?.align || data?.align || 'full');

	// Compute CSS classes dynamically for alignment
	const blockClasses = $derived(() => {
		const classes = ['block', 'video'];
		classes.push(`has--align--${alignment}`);
		return classes.join(' ');
	});
</script>

<div class={blockClasses()}>
	{#if videoSource === 'youtube' && embedUrl()}
		<div class="video-wrapper">
			<iframe
				src={embedUrl()}
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	{:else if videoSource === 'vimeo' && embedUrl()}
		<div class="video-wrapper">
			<iframe
				src={embedUrl()}
				title="Vimeo video player"
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	{:else if videoSource === 'self-hosted' && videoSrc}
		<div class="video-wrapper">
			<video src={videoSrc} controls poster={posterImage}></video>
		</div>
	{/if}
</div>
