<script lang="ts">
  let { children, node, parent } = $props();
</script>

<span>
  {@render children?.()}
</span>
