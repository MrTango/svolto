<script lang="ts">
	let { children, node, parent } = $props();
</script>

<h4 class="slate-h4">
	{@render children?.()}
</h4>
