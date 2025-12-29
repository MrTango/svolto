<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="layout-wrapper">
	{@render children()}
</main>

<style>
main {
	max-width: 1127px;
	margin: 0 auto;
}
</style>