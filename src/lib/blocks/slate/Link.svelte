<script lang="ts">
  let { children, node, parent } = $props();
</script>

<a href={parent.data.url}>
  {@render children?.()}
</a>
