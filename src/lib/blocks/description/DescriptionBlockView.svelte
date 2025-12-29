<script lang="ts">
	let { id, data, metadata, properties, path, ...others } = $props();

	const rawDescription = (metadata || properties)?.description || '';

	function truncateAtWordBoundary(text: string, maxLength: number): string {
		if (text.length <= maxLength) {
			return text;
		}

		const truncated = text.slice(0, maxLength);
		const lastSpaceIndex = truncated.lastIndexOf(' ');

		if (lastSpaceIndex > 0) {
			return truncated.slice(0, lastSpaceIndex) + '...';
		}

		return truncated + '...';
	}

	const description = data?.maxLength
		? truncateAtWordBoundary(rawDescription, data.maxLength)
		: rawDescription;
</script>

<p class="documentDescription">{description}</p>
