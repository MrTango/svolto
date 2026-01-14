<script lang="ts">
	import { generateAnchorId, extractTextFromSlateNode } from '../toc/utils';

	let { children, node, parent, blockId = '' } = $props();

	let anchorId = $derived(blockId ? generateAnchorId(blockId, extractTextFromSlateNode(node)) : '');
</script>

<h5 class="slate-h5" id={anchorId || undefined}>
	{@render children?.()}
</h5>
