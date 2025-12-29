<script>
	// import { page } from '$app/stores';
	import '../../lib/main.scss';
	// import Contextnav from '$lib/plone/contextnav.svelte';
	export let data = {};
	let navigation = [];
	let breadcrumbs = [];
	$: {
		navigation = data.navigation || [];
		breadcrumbs = data.breadcrumbs || [];
	}
</script>

<svelte:head></svelte:head>

<slot />

<!-- <main class="container">
	{#if $page.data.fullwidth === undefined}
		<aside>
			<Contextnav contextNav={data.contextnavigation} />
		</aside>
	{/if}

	<div id="content" role="document">
		<slot />
  </div>
</main> -->

<style lang="scss">
	// main {
	//   display: grid;
	//   grid-template-columns: 1fr;
	//   grid-template-rows: auto;
	//   grid-template-areas:
	//     'breadcrumbs'
	//     'content';
	// }
	// @media only screen and (min-width: 478px) {
	//   main {
	//     grid-template-columns: 1fr 1fr 1fr 1fr;
	//     grid-template-areas:
	//       'breadcrumbs breadcrumbs breadcrumbs breadcrumbs'
	//       'sidebar content content content';
	//   }
	// }
	// header {
	// 	background-color: coral;
	// 	a {
	// 		color: white !important;
	// 	}
	// 	padding: 0.2em 0;
	// }
	// nav[name='breadcrumbs'] {
	// 	grid-area: breadcrumbs;
	// 	--font-size: 0.8rem;
	// 	background-color: ghostwhite;
	// }
	// aside {
	// 	grid-area: sidebar;
	// 	/* margin: var(--block-spacing-vertical) 0; */
	// 	padding: var(--block-spacing-vertical) var(--block-spacing-horizontal)
	// 		var(--block-spacing-vertical) 0;
	// }
	// #content {
	// 	grid-area: content;
	// }
</style>
