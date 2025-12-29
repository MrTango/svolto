<script lang="ts">
	let { children, node, parent } = $props();
</script>

<sup class="slate-sup">
	{@render children?.()}
</sup>
