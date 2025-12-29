<script lang="ts">
	let { children, node, parent } = $props();
</script>

<ol class="slate-ol">
	{@render children?.()}
</ol>
