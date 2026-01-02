<script lang="ts">
	import type { TocEntry } from '../types';

	let {
		entries = [],
		ordered = false
	}: {
		entries: TocEntry[];
		ordered?: boolean;
	} = $props();
</script>

<div class="toc-default">
	{#if ordered}
		<ol class="toc-list">
			{#each entries as entry}
				<li class="toc-item toc-level-{entry.level}">
					<a href="#{entry.id}" class="toc-link">{entry.title}</a>
					{#if entry.children && entry.children.length > 0}
						<ol class="toc-list toc-nested">
							{#each entry.children as child}
								<li class="toc-item toc-level-{child.level}">
									<a href="#{child.id}" class="toc-link">{child.title}</a>
								</li>
							{/each}
						</ol>
					{/if}
				</li>
			{/each}
		</ol>
	{:else}
		<ul class="toc-list">
			{#each entries as entry}
				<li class="toc-item toc-level-{entry.level}">
					<a href="#{entry.id}" class="toc-link">{entry.title}</a>
					{#if entry.children && entry.children.length > 0}
						<ul class="toc-list toc-nested">
							{#each entry.children as child}
								<li class="toc-item toc-level-{child.level}">
									<a href="#{child.id}" class="toc-link">{child.title}</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.toc-default {
		--toc-link-color: var(--color-text, #333);
		--toc-link-hover-color: var(--color-primary, #0066cc);
		--toc-item-gap: 0.5rem;
		--toc-nested-indent: 1.25rem;
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--toc-item-gap);
	}

	.toc-nested {
		margin-top: var(--toc-item-gap);
		padding-left: var(--toc-nested-indent);
	}

	.toc-item {
		line-height: 1.4;
	}

	.toc-level-3 {
		padding-left: var(--toc-nested-indent);
	}

	.toc-level-4 {
		padding-left: calc(var(--toc-nested-indent) * 2);
	}

	.toc-level-5 {
		padding-left: calc(var(--toc-nested-indent) * 3);
	}

	.toc-level-6 {
		padding-left: calc(var(--toc-nested-indent) * 4);
	}

	.toc-link {
		color: var(--toc-link-color);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.toc-link:hover {
		color: var(--toc-link-hover-color);
		text-decoration: underline;
	}

	.toc-link:focus {
		outline: 2px solid var(--toc-link-hover-color);
		outline-offset: 2px;
	}

	/* Ordered list styling */
	ol.toc-list {
		list-style: decimal;
		padding-left: 1.5rem;
	}

	ol.toc-nested {
		list-style: lower-alpha;
	}
</style>
