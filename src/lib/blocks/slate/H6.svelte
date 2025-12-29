<script lang="ts">
	let { children, node, parent } = $props();
</script>

<h6 class="slate-h6">
	{@render children?.()}
</h6>
