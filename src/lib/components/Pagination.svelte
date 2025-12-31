<script lang="ts">
	/**
	 * Reusable Pagination Component
	 *
	 * Renders pagination controls with prev/next links and page numbers.
	 * Uses URL query parameter `?page=N` for navigation (single block) or
	 * `?page-{blockId}=N` for multi-block pagination.
	 *
	 * @example
	 * <Pagination currentPage={2} totalPages={10} baseUrl="/news/" />
	 *
	 * @example Multi-block pagination
	 * <Pagination
	 *   currentPage={2}
	 *   totalPages={10}
	 *   baseUrl="/news/"
	 *   blockId="block-123"
	 *   paginatedBlockCount={2}
	 * />
	 */

	import { slugifyBlockId } from '$lib/blocks/listing/api';

	let {
		currentPage = 1,
		totalPages = 1,
		baseUrl = '/',
		blockId = undefined,
		paginatedBlockCount = 1
	}: {
		/** Current active page (1-indexed) */
		currentPage?: number;
		/** Total number of pages */
		totalPages?: number;
		/** Base URL for building page links */
		baseUrl?: string;
		/** Optional block ID for block-specific pagination keys */
		blockId?: string | undefined;
		/** Number of paginated blocks on the page (determines key format) */
		paginatedBlockCount?: number;
	} = $props();

	// Maximum number of page links to show (excluding prev/next)
	const MAX_VISIBLE_PAGES = 7;

	/**
	 * Build URL for a specific page
	 * Uses 'page' param when single block, 'page-{slugifiedBlockId}' for multiple blocks
	 */
	function buildPageUrl(page: number): string {
		// Parse the baseUrl to handle query parameters properly
		let url: URL;
		try {
			// Try to parse as absolute URL
			url = new URL(baseUrl);
		} catch {
			// If not absolute, create a full URL with a placeholder origin
			url = new URL(baseUrl, 'http://placeholder.local');
		}

		// Determine the parameter key based on block count
		const useBlockSpecificKey = paginatedBlockCount > 1 && blockId;
		const paramKey = useBlockSpecificKey ? `page-${slugifyBlockId(blockId)}` : 'page';

		if (page <= 1) {
			// Remove page parameter for page 1
			url.searchParams.delete(paramKey);
		} else {
			url.searchParams.set(paramKey, String(page));
		}

		// Return pathname + search (relative URL)
		return url.pathname + url.search;
	}

	// Calculate which page numbers to show
	const visiblePages = $derived(() => {
		if (totalPages <= MAX_VISIBLE_PAGES) {
			// Show all pages if total is small
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const pages: (number | 'ellipsis')[] = [];
		const halfVisible = Math.floor((MAX_VISIBLE_PAGES - 2) / 2);

		// Always show first page
		pages.push(1);

		// Calculate start and end of middle section
		let start = Math.max(2, currentPage - halfVisible);
		let end = Math.min(totalPages - 1, currentPage + halfVisible);

		// Adjust if we're near the beginning or end
		if (currentPage <= halfVisible + 1) {
			end = Math.min(totalPages - 1, MAX_VISIBLE_PAGES - 2);
		} else if (currentPage >= totalPages - halfVisible) {
			start = Math.max(2, totalPages - MAX_VISIBLE_PAGES + 3);
		}

		// Add ellipsis before middle section if needed
		if (start > 2) {
			pages.push('ellipsis');
		}

		// Add middle pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add ellipsis after middle section if needed
		if (end < totalPages - 1) {
			pages.push('ellipsis');
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	});

	// Determine if prev/next buttons should be enabled
	const hasPrev = $derived(currentPage > 1);
	const hasNext = $derived(currentPage < totalPages);

	// URLs for prev/next
	const prevUrl = $derived(hasPrev ? buildPageUrl(currentPage - 1) : '#');
	const nextUrl = $derived(hasNext ? buildPageUrl(currentPage + 1) : '#');
</script>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Pagination navigation">
		<ul class="pagination-list">
			<!-- Previous button -->
			<li class="pagination-item">
				{#if hasPrev}
					<a
						href={prevUrl}
						class="pagination-link pagination-prev"
						aria-label="Go to previous page"
					>
						<span aria-hidden="true">&laquo;</span>
						<span class="pagination-prev-text">Previous</span>
					</a>
				{:else}
					<span class="pagination-link pagination-prev is-disabled" aria-disabled="true">
						<span aria-hidden="true">&laquo;</span>
						<span class="pagination-prev-text">Previous</span>
					</span>
				{/if}
			</li>

			<!-- Page numbers -->
			{#each visiblePages() as pageItem, index}
				<li class="pagination-item">
					{#if pageItem === 'ellipsis'}
						<span class="pagination-ellipsis" aria-hidden="true">&hellip;</span>
					{:else if pageItem === currentPage}
						<span
							class="pagination-link is-current"
							aria-current="page"
							aria-label="Page {pageItem}"
						>
							{pageItem}
						</span>
					{:else}
						<a
							href={buildPageUrl(pageItem)}
							class="pagination-link"
							aria-label="Go to page {pageItem}"
						>
							{pageItem}
						</a>
					{/if}
				</li>
			{/each}

			<!-- Next button -->
			<li class="pagination-item">
				{#if hasNext}
					<a href={nextUrl} class="pagination-link pagination-next" aria-label="Go to next page">
						<span class="pagination-next-text">Next</span>
						<span aria-hidden="true">&raquo;</span>
					</a>
				{:else}
					<span class="pagination-link pagination-next is-disabled" aria-disabled="true">
						<span class="pagination-next-text">Next</span>
						<span aria-hidden="true">&raquo;</span>
					</span>
				{/if}
			</li>
		</ul>
	</nav>
{/if}

<style>
	/* CSS Custom Properties for theming */
	.pagination {
		--pagination-gap: 0.25rem;
		--pagination-link-padding: 0.5rem 0.75rem;
		--pagination-link-color: var(--color-text, #333);
		--pagination-link-bg: transparent;
		--pagination-link-border: 1px solid var(--color-border, #e5e5e5);
		--pagination-link-radius: 4px;
		--pagination-link-hover-bg: var(--color-surface-hover, #f5f5f5);
		--pagination-link-hover-border-color: var(--color-primary, #0066cc);
		--pagination-current-bg: var(--color-primary, #0066cc);
		--pagination-current-color: white;
		--pagination-disabled-opacity: 0.5;

		margin-top: 2rem;
	}

	.pagination-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--pagination-gap);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.pagination-item {
		margin: 0;
	}

	.pagination-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: var(--pagination-link-padding);
		color: var(--pagination-link-color);
		background: var(--pagination-link-bg);
		border: var(--pagination-link-border);
		border-radius: var(--pagination-link-radius);
		text-decoration: none;
		font-size: 0.875rem;
		line-height: 1;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.pagination-link:hover:not(.is-disabled):not(.is-current) {
		background: var(--pagination-link-hover-bg);
		border-color: var(--pagination-link-hover-border-color);
	}

	.pagination-link.is-current {
		background: var(--pagination-current-bg);
		border-color: var(--pagination-current-bg);
		color: var(--pagination-current-color);
		font-weight: 600;
	}

	.pagination-link.is-disabled {
		opacity: var(--pagination-disabled-opacity);
		cursor: not-allowed;
	}

	.pagination-ellipsis {
		padding: var(--pagination-link-padding);
		color: var(--pagination-link-color);
	}

	/* Hide text on mobile, show only arrows */
	@media (max-width: 640px) {
		.pagination-prev-text,
		.pagination-next-text {
			display: none;
		}

		.pagination-link {
			padding: 0.5rem;
		}
	}
</style>
