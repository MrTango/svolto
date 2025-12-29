<script lang="ts">
	let { children, node, parent } = $props();
</script>

<strong class="slate-strong">
	{@render children?.()}
</strong>
