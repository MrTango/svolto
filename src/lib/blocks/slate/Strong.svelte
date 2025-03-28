<script lang="ts">
  let { children, node, parent } = $props();
</script>

<strong>
  {@render children?.()}
</strong>
