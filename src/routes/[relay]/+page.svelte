<script lang="ts">
  import { formattedData, getGraphData } from "$lib/app";
  import Charts from "../../components/charts.svelte";
  import DataTable from "../../components/datatable.svelte";
  import BaseInfo from "../../components/baseinfo.svelte";
  import { page } from "$app/stores";

  const relay: string = $page.params.relay;
  let items: any = null;
  (async () => {
    const result = await getGraphData(`nostr-arrival-rate_${relay}`);
    if (!result) return;
    items = formattedData(result, 10, 10);
    console.log(items);
  })();
</script>

{#if items}
  <div class="max-width mx-auto container">
    <BaseInfo />
  </div>
  <div class="p-2" />
  <div class="row max-width mx-auto">
    <div class="col-12 col-md-3 order-2">
      <DataTable {items} />
    </div>
    <div class="col-12 col-md-9 order-1">
      <Charts {items} />
    </div>
  </div>
{/if}
