<script lang="ts">
	import { Node, Text } from 'slate';
	import Leaf from './Leaf.svelte';

	let { key, id, data, ...others } = $props();
	const editor = {children: data.value || []}
	console.log(data);

</script>

<div class="block slate">
	{#each editor.children as node}
		{#if Text.isText(node)}
			<span>{node.text}</span>
		{/if}
		{#each node.children as childNode}
			<Leaf node={childNode} parent={node} />
		{/each}
	{/each}
</div>
