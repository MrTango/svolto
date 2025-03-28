<script lang="ts">
	// import { Text } from 'slate';
	import Em from './Em.svelte';
	import H2 from './H2.svelte';
	import H3 from './H3.svelte';
	import Leaf from './Leaf.svelte';
	import Li from './Li.svelte';
	import Link from './Link.svelte';
	import Ol from './Ol.svelte';
	import Strong from './Strong.svelte';
	import Text from './Text.svelte';
	import Ul from './Ul.svelte';

	let { node, parent } = $props();

  const NodeTypes = {
    link: {
      view: Link,
    },
    strong: {
      view: Strong,
    },
    em: {
      view: Em,
    },
    h2: {
      view: H2,
    },
    h3: {
      view: H3,
    },
    ul: {
      view: Ul,
    },
    ol: {
      view: Ol,
    },
    li: {
      view: Li,
    },
    text: {
      view: Text,
    }
  }

  // type NodeComponentType = Strong | Text
  type NodeTypes = 'strong' | 'text'

  let nodeType = (parent?.type || 'text') as NodeTypes
  // console.log(nodeType, parent?.type)
  if (nodeType in NodeTypes === false){
    console.warn(`not implemented slate nodeType: ${nodeType}!`)
    nodeType = 'text';
  }
  let SlateComponent = $derived(NodeTypes[nodeType].view);

</script>

<SlateComponent node={node} parent={parent}>
  {node.text}

{#each node.children as childNode}
	<Leaf node={childNode} parent={node}></Leaf>
{/each}
</SlateComponent>


