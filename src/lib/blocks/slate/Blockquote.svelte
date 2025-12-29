<script lang="ts">
	let { children, node, parent } = $props();
</script>

<blockquote class="slate-blockquote">
	{@render children?.()}
</blockquote>
