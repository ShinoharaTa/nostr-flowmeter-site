<script lang="ts">
  import { formattedData, getGraphData } from "$lib/app";
  import Charts from "../../components/charts.svelte";
  import DataTable from "../../components/datatable.svelte";
  import BaseInfo from "../../components/baseinfo.svelte";
  import { page } from "$app/stores";
  import { getRelay, type RelayItem } from "$lib/config";

  const relay: string = $page.params.relay;
  let items: any = null;
  (async () => {
    const result = await getGraphData(`nostr-arrival-rate_${relay}`);
    if (!result) return;
    items = formattedData(result, 10, 10);
    console.log(items);
  })();
  const info: RelayItem | undefined = getRelay(relay);
</script>

{#if items && info}
  <div class="max-width mx-auto container">
    <BaseInfo {info} />
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
{:else if items?.length <= 0}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1">404</div>
    <div class="fs-3">Not Found</div>
    <div class="mt-4">ページが見つかりません</div>
  </div>
{:else}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1" />
    <div class="fs-3">Now loading...</div>
    <div class="mt-4">読み込み中</div>
  </div>
{/if}
