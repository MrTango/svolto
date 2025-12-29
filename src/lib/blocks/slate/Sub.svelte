<script lang="ts">
	let { children, node, parent } = $props();
</script>

<sub class="slate-sub">
	{@render children?.()}
</sub>
