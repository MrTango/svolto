<script lang="ts">
  let { children, node, parent } = $props();
</script>

<ul>
  {@render children?.()}
</ul>
