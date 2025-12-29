<script>
	export let navigation = [];
</script>

<nav>
	<ul>
		{#each navigation as navItem}
			<li><a href={navItem.href}>{navItem.title}</a></li>
		{/each}
	</ul>
</nav>

<style>
</style>
