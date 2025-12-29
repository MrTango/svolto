<script lang="ts">
	let { children, node, parent } = $props();
</script>

<u class="slate-underline">
	{@render children?.()}
</u>
