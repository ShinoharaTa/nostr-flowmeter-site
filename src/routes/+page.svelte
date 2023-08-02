<script lang="ts">
  // import { onMount } from "svelte";
  // import { formattedData, getGraphData } from "$lib/app";
  // let items: any = null;
  // (async () => {
  //   const result = await getGraphData("nostr-arrival-rate");
  //   if (!result) return;
  //   items = formattedData(result, 10, 10);
  //   console.log(items);
  // })();
</script>

<!-- {#if items} -->
<div class="bg-main text-center py-5">
  <div class="fs-1">野州田川水系</div>
  <div class="fs-3 mt-2">定点観測所</div>
</div>
<div class="row max-width mx-auto pt-4 fs-4 text-center">
  <div><a href="/kojira">こじら川</a></div>
  <div><a href="/yabumi">やぶみ川</a></div>
  <div><a href="/kirino">きりの川</a></div>
</div>
<!-- {/if} -->
