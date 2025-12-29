<script lang="ts">
	let { children, node, parent } = $props();
</script>

<h3 class="slate-h3">
	{@render children?.()}
</h3>
