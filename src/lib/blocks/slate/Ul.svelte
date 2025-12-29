<script lang="ts">
	let { children, node, parent } = $props();
</script>

<ul class="slate-ul">
	{@render children?.()}
</ul>
