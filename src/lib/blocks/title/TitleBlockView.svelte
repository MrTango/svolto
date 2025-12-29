<script lang="ts">
	let { key, id, data, properties, ...others } = $props();
</script>

<h1 class="documentFirstHeading">{properties?.title || ''}</h1>
