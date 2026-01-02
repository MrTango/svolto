<script lang="ts">
	import { generateAnchorId, extractTextFromSlateNode } from '../toc/utils';

	let { children, node, parent, blockId = '' } = $props();

	let anchorId = $derived(blockId ? generateAnchorId(blockId, extractTextFromSlateNode(node)) : '');
</script>

<h4 class="slate-h4" id={anchorId || undefined}>
	{@render children?.()}
</h4>
