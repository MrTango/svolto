<script lang="ts">
	let { children, node, parent } = $props();
</script>

<s class="slate-strikethrough">
	{@render children?.()}
</s>
