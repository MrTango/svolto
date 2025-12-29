<script lang="ts">
	let { children, node, parent } = $props();
</script>

<h2 class="slate-h2">
	{@render children?.()}
</h2>
