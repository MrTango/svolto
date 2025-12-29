<script lang="ts">
	import Leaf from '../slate/Leaf.svelte';

	let { key, id, data, ...others } = $props();
	const editor = { children: data.value || [] };
</script>

<div class="introduction-block">
	{#each editor.children as node}
		<Leaf {node} parent={null} />
	{/each}
</div>
