<script lang="ts">
  import { onMount } from "svelte";
  import { formattedData, getGraphData } from "$lib/app";
  import Charts from "../components/charts.svelte";
  let items: any = null;
  (async () => {
    const result = await getGraphData("nostr-arrival-rate");
    if (!result) return;
    items = formattedData(result, 10, 10);
    console.log(items);
  })();
</script>

<div class="page">
  {#if items}
    <Charts {items} />
  {/if}
</div>
