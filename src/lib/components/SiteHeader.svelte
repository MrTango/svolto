<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { NavItem } from '$lib/plone/navigation';
	import { Navigation } from '$lib/plone/navigation';

	interface Props {
		navigation: NavItem[];
		currentPath: string;
		logo?: Snippet;
		utility?: Snippet;
	}

	let { navigation, currentPath, logo, utility }: Props = $props();
</script>

<header class="site-header">
	<div class="header-inner container-layout">
		<div class="header-logo">
			{#if logo}
				{@render logo()}
			{:else}
				<a href="/" class="logo-link" aria-label="Home">
					<span class="logo-text">Svolto</span>
				</a>
			{/if}
		</div>

		<div class="header-nav">
			<Navigation {navigation} {currentPath} />
		</div>

		<div class="header-utility">
			{#if utility}
				{@render utility()}
			{/if}
		</div>
	</div>
</header>
