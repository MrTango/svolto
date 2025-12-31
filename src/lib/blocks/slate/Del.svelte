<script lang="ts">
	let { children, node, parent } = $props();
</script>

<del class="slate-del">
	{@render children?.()}
</del>
