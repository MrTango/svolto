<script lang="ts">
	let { children, node, parent } = $props();

	/**
	 * Resolves the URL for the link based on the link type:
	 * - Internal links: Extract path from internal_link data
	 * - External links: Use URL directly
	 * - Email links: Preserve mailto: protocol
	 *
	 * The link data can be on the node itself (when Leaf passes it)
	 * or on the parent (legacy compatibility)
	 */
	function resolveUrl(linkNode: typeof node, linkParent: typeof parent): string {
		// Link data can be on node (current) or parent (legacy)
		const linkData = linkNode?.data || linkParent?.data;
		const url = linkData?.url || '';

		// Check for internal link with resolveuid pattern
		if (url.includes('resolveuid')) {
			const internalLink = linkData?.link?.internal?.internal_link?.[0];
			if (internalLink?.['@id']) {
				// Extract path from full URL (e.g., "http://localhost:8080/Plone/my-page" -> "/my-page")
				try {
					const fullUrl = new URL(internalLink['@id']);
					// Remove the /Plone prefix if present
					let path = fullUrl.pathname;
					if (path.startsWith('/Plone')) {
						path = path.substring(6) || '/';
					}
					return path;
				} catch {
					// If URL parsing fails, return original
					return url;
				}
			}
		}

		// External and email links use URL directly
		return url;
	}

	const href = $derived(resolveUrl(node, parent));
</script>

<a {href} class="slate-link">
	{@render children?.()}
</a>
