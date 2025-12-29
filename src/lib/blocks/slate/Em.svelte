<script lang="ts">
	let { children, node, parent } = $props();
</script>

<em class="slate-em">
	{@render children?.()}
</em>
