<script lang="ts">
	let { children, node, parent } = $props();

	const hasBlockChildren = node?.children?.some(
		(child: { type?: string }) =>
			child.type && ['p', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote'].includes(child.type)
	);

	const isNestedInParagraph = parent?.type === 'p';
</script>

{#if isNestedInParagraph}
	<span class="slate-paragraph-nested">
		{@render children?.()}
	</span>
{:else if hasBlockChildren}
	<div class="slate-paragraph">
		{@render children?.()}
	</div>
{:else}
	<p class="slate-paragraph">
		{@render children?.()}
	</p>
{/if}
