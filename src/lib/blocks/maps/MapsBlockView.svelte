<script lang="ts">
	let { key, id, data, metadata, properties, path, blocksConfig } = $props();

	const alignment = $derived(data?.styles?.align || data?.align || 'full');

	const blockClasses = $derived(() => {
		const classes = ['block', 'maps'];
		classes.push(`has--align--${alignment}`);
		return classes.join(' ');
	});

	const iframeTitle = $derived(data?.title || 'Google Maps embed');
	const ariaLabel = $derived(data?.title || 'Map location');
	const noscriptTitle = $derived(data?.title || 'this location');
</script>

<div class={blockClasses()}>
	<a href="#after-map-{id}" class="skip-map-link">Skip map</a>

	<div class="maps-wrapper" role="region" aria-label={ariaLabel}>
		{#if data?.url}
			<iframe
				src={data.url}
				title={iframeTitle}
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allowfullscreen
				frameborder="0"
			></iframe>
		{/if}
	</div>

	<noscript>
		<p>View <a href={data?.url}>{noscriptTitle}</a> on Google Maps</p>
	</noscript>

	<span id="after-map-{id}"></span>
</div>
