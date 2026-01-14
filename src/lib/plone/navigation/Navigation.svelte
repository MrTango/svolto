<script lang="ts">
	import type { NavItem } from './types';
	import MegaNav from './MegaNav.svelte';
	import MobileNav from './MobileNav.svelte';
	import './nav-variables.css';

	interface Props {
		navigation: NavItem[];
		currentPath: string;
	}

	let { navigation, currentPath }: Props = $props();
</script>

<div class="navigation-wrapper">
	<MegaNav {navigation} {currentPath} />
	<MobileNav {navigation} {currentPath} />
</div>

<style>
	.navigation-wrapper {
		position: relative;
	}
</style>
