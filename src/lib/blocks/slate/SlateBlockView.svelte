<script lang="ts">
	import Leaf from './Leaf.svelte';

	let { key, id, data, ...others } = $props();
	const editor = { children: data.value || [] };
</script>

<div class="block slate">
	{#each editor.children as node}
		<Leaf {node} parent={null} blockId={id} />
	{/each}
</div>
