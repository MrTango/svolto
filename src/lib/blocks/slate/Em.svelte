<script lang="ts">
  let { children, node, parent } = $props();
</script>

<em>
  {@render children?.()}
</em>
