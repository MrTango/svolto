<script lang="ts">
	let { children, node, parent } = $props();
</script>

<li class="slate-li">
	{@render children?.()}
</li>
