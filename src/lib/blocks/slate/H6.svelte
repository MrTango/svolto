<script lang="ts">
	import { generateAnchorId, extractTextFromSlateNode } from '../toc/utils';

	let { children, node, parent, blockId = '' } = $props();

	let anchorId = $derived(blockId ? generateAnchorId(blockId, extractTextFromSlateNode(node)) : '');
</script>

<h6 class="slate-h6" id={anchorId || undefined}>
	{@render children?.()}
</h6>
