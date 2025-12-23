<script lang="ts">
  let { children, node, parent } = $props();
</script>

<ul class="list-inside list-disc">
  {@render children?.()}
</ul>
