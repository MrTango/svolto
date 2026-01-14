<script lang="ts">
	let { key, id, data, metadata, properties, path, blocksConfig } = $props();

	const hasContent = $derived(data?.html && data.html.trim().length > 0);

	const alignment = $derived(data?.styles?.align || 'left');

	const blockClasses = $derived(() => {
		const classes = ['block', 'html'];
		classes.push(`has--align--${alignment}`);
		if (data?.styles?.customCss) {
			classes.push(data.styles.customCss);
		}
		return classes.join(' ');
	});
</script>

{#if hasContent}
	<div class={blockClasses()}>
		{@html data.html}
	</div>
{/if}
