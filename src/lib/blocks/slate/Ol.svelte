<script lang="ts">
  let { children, node, parent } = $props();
</script>

<ol class="list-inside list-decimal">
  {@render children?.()}
</ol>
