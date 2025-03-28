<script lang="ts">
  let { children, node, parent } = $props();
</script>

<li>
  {@render children?.()}
</li>
