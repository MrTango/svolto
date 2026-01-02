<script lang="ts">
	import '../../lib/main.scss';

	let { children } = $props();
</script>

<svelte:head></svelte:head>

{@render children()}
