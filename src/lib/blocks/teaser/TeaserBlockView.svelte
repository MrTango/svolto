<script lang="ts">
	let { key, id, data, ...others } = $props();
  const image_data = data.image_scales.image[0]
  let image_scales = [];
  // console.log(data)
  // console.log(image_data)
  for (const [key, value] of Object.entries(image_data.scales)) {
    image_scales.push(`${data.url}/${value.download} ${value.width}w`);
  }
  const srcset = image_scales.join(",")
</script>

<p class="block teaser">
	<picture
		><source
			srcset={srcset} /><img
			alt={data.alt}
			class="image-richtext picture-variant-large"
			height="453"
			loading="lazy"
			src={data.download}
			width="1000"
		  />
  </picture>
</p>
