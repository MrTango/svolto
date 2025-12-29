<script lang="ts">
	let { children, node, parent } = $props();
</script>

<p class="slate-paragraph">
	{@render children?.()}
</p>
