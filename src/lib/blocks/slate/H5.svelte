<script lang="ts">
	let { children, node, parent } = $props();
</script>

<h5 class="slate-h5">
	{@render children?.()}
</h5>
