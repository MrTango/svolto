<script lang="ts">
	import type { ListingItem, LinkHrefItem } from '../types';

	let {
		items = [],
		linkTitle,
		linkHref
	}: {
		items: ListingItem[];
		linkTitle?: string;
		linkHref?: LinkHrefItem[];
	} = $props();

	// Extract path from item @id (removes Plone prefix)
	function getItemPath(item: ListingItem): string {
		if (!item['@id']) return '#';
		try {
			const url = new URL(item['@id']);
			return url.pathname.replace(/^\/Plone/, '') || '/';
		} catch {
			const id = item['@id'];
			const ploneIndex = id.indexOf('/Plone');
			if (ploneIndex !== -1) {
				return id.substring(ploneIndex + 6) || '/';
			}
			return id;
		}
	}

	// Extract path from linkHref
	const linkMorePath = $derived(() => {
		if (!linkHref?.[0]?.['@id']) return null;
		try {
			const url = new URL(linkHref[0]['@id']);
			return url.pathname.replace(/^\/Plone/, '') || '/';
		} catch {
			const id = linkHref[0]['@id'];
			const ploneIndex = id.indexOf('/Plone');
			if (ploneIndex !== -1) {
				return id.substring(ploneIndex + 6) || '/';
			}
			return id;
		}
	});

	// Determine if "Link More" should be shown
	const showLinkMore = $derived(!!linkTitle && !!linkMorePath());
</script>

<div class="listing-default">
	{#if items.length > 0}
		<ul class="listing-items">
			{#each items as item}
				<li class="listing-item">
					<a href={getItemPath(item)} class="listing-item-link">
						<span class="listing-item-title">{item.title}</span>
					</a>
					{#if item.description}
						<p class="listing-item-description">{item.description}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	{#if showLinkMore}
		<div class="listing-footer">
			<a href={linkMorePath()} class="link-more">{linkTitle}</a>
		</div>
	{/if}
</div>

<style>
	.listing-default {
		--listing-item-gap: 1rem;
		--listing-link-color: inherit;
		--listing-link-hover-color: var(--color-primary, #0066cc);
	}

	.listing-items {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--listing-item-gap);
	}

	.listing-item {
		padding-bottom: var(--listing-item-gap);
		border-bottom: 1px solid var(--color-border, #e5e5e5);
	}

	.listing-item:last-child {
		border-bottom: none;
	}

	.listing-item-link {
		text-decoration: none;
		color: var(--listing-link-color);
	}

	.listing-item-link:hover {
		color: var(--listing-link-hover-color);
		text-decoration: underline;
	}

	.listing-item-title {
		font-weight: 600;
		font-size: 1.125rem;
	}

	.listing-item-description {
		margin: 0.5rem 0 0;
		color: var(--color-text-muted, #666);
		line-height: 1.5;
	}

	.listing-footer {
		margin-top: 1.5rem;
		text-align: center;
	}

	.link-more {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-primary, #0066cc);
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.link-more:hover {
		background-color: var(--color-primary-dark, #0052a3);
	}
</style>
