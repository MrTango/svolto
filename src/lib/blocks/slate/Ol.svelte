<script lang="ts">
  let { children, node, parent } = $props();
</script>

<ol>
  {@render children?.()}
</ol>
