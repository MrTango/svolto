<script lang="ts">
	import { Text as SlateText } from 'slate';
	import Blockquote from './Blockquote.svelte';
	import Code from './Code.svelte';
	import Del from './Del.svelte';
	import Em from './Em.svelte';
	import H2 from './H2.svelte';
	import H3 from './H3.svelte';
	import H4 from './H4.svelte';
	import H5 from './H5.svelte';
	import H6 from './H6.svelte';
	import Leaf from './Leaf.svelte';
	import Li from './Li.svelte';
	import Link from './Link.svelte';
	import Ol from './Ol.svelte';
	import P from './P.svelte';
	import Strikethrough from './Strikethrough.svelte';
	import Strong from './Strong.svelte';
	import Sub from './Sub.svelte';
	import Sup from './Sup.svelte';
	import Text from './Text.svelte';
	import Ul from './Ul.svelte';
	import Underline from './Underline.svelte';

	let { node, parent, blockId = '' } = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const NodeTypes: Record<string, { view: any }> = {
		// Block elements
		p: { view: P },
		h2: { view: H2 },
		h3: { view: H3 },
		h4: { view: H4 },
		h5: { view: H5 },
		h6: { view: H6 },
		blockquote: { view: Blockquote },
		ul: { view: Ul },
		ol: { view: Ol },
		li: { view: Li },
		// Inline elements
		link: { view: Link },
		strong: { view: Strong },
		em: { view: Em },
		underline: { view: Underline },
		strikethrough: { view: Strikethrough },
		del: { view: Del },
		sub: { view: Sub },
		sup: { view: Sup },
		code: { view: Code },
		// Text fallback
		text: { view: Text }
	};

	type NodeType = keyof typeof NodeTypes;

	const HEADING_TYPES = ['h2', 'h3', 'h4', 'h5', 'h6'];

	// Determine the node type from the node itself, not the parent
	// Text nodes (with only 'text' property) get 'text' type
	// Element nodes have a 'type' property
	let nodeType: NodeType;

	if (SlateText.isText(node)) {
		nodeType = 'text';
	} else if (node?.type && node.type in NodeTypes) {
		nodeType = node.type as NodeType;
	} else if (node?.type) {
		console.warn(`not implemented slate nodeType: ${node.type}!`);
		nodeType = 'p'; // Fallback to paragraph for unknown element types
	} else {
		nodeType = 'text'; // Default to text for nodes without type
	}

	let SlateComponent = $derived(NodeTypes[nodeType].view);
	let isHeading = $derived(HEADING_TYPES.includes(nodeType));
</script>

{#if isHeading}
	<SlateComponent {node} {parent} {blockId}>
		{#if SlateText.isText(node)}
			{node.text}
		{:else if node?.children}
			{#each node.children as childNode}
				<Leaf node={childNode} parent={node} {blockId} />
			{/each}
		{/if}
	</SlateComponent>
{:else}
	<SlateComponent {node} {parent}>
		{#if SlateText.isText(node)}
			{node.text}
		{:else if node?.children}
			{#each node.children as childNode}
				<Leaf node={childNode} parent={node} {blockId} />
			{/each}
		{/if}
	</SlateComponent>
{/if}
