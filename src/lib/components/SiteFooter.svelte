<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<footer class="site-footer">
	<div class="footer-content container-layout">
		{#if children}
			{@render children()}
		{:else}
			<p>&copy; {new Date().getFullYear()} All rights reserved.</p>
		{/if}
	</div>
</footer>
