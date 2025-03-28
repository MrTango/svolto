<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="layout-wrapper">

{@render children()}

</main>