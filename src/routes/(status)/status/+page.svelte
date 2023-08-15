<script lang="ts">
  import { relays } from "$lib/config";
  import { getTable, utilKeyValueArrayToObject } from "nostr-key-value";
  import { onMount } from "svelte";
  import HealthChart from "../../../components/health-chart.svelte";
  import HarfmoonChart from "../../../components/harfmoon-chart.svelte";

  const status: { [key: string]: any } = {};
  let isLoaded: boolean = false;
  let updated_at: string = "";
  let scale: number = 0;
  let healthCount: number[] = [];
  onMount(async () => {
    const table = await getTable(
      ["wss://relay-jp.nostr.wirednet.jp"],
      "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6",
      "relay_health_status"
    );
    console.log(table);
    if (table) {
      const temp = utilKeyValueArrayToObject(table.tags);
      for (const relay of relays) {
        status[relay.key] = JSON.parse(<string>temp[relay.key]);
        const total = status[relay.key].count.length;
        const errorCount = status[relay.key].count.filter(
          (item: number) => item === 0 || isNaN(item)
        ).length;
        status[relay.key].health = Math.round(
          ((total - errorCount) / total) * 100
        );

        healthCount = healthCount.concat(status[relay.key].count);
      }
      updated_at = <string>temp.updated_at;
    }
    const total = healthCount.length;
    const errorCount = healthCount.filter(
      (item) => item === 0 || isNaN(item)
    ).length;
    scale = Math.round(((total - errorCount) / total) * 100);
    isLoaded = true;
  });
</script>

<div class="outline">
  {#if isLoaded}
    <div class="container pt-4">
      <div class="row g-3">
        <div class="col-12">
          <div
            class="bg-dark p-3 content text-white d-md-flex justify-content-between align-items-end"
          >
            <div class="fs-3">野洲田川水系最新ステータス</div>
            <div>{updated_at}</div>
          </div>
        </div>
        <div class="col-12 col-md-3 order-md-last">
          <div class="bg-dark p-4 content h-100">
            <div class="row align-items-center">
              <div class="col-4 col-md-12">
                <HarfmoonChart {scale} />
              </div>
              <div class="col-8 col-md-12">
                <div class="fs-3 text-white text-md-center">{scale} %</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-9 order-1">
          <div class="bg-dark p-3 content">
            {#each relays as relay}
              <div class="align-items-center d-md-flex mb-3">
                <div class="fs-md-5 flex-fill text-white mb-2 mb-md-0">
                  {relay.relay_url}
                </div>
                <div class="d-flex fs-md-6">
                  <HealthChart items={status[relay.key].count} />
                  {#if status[relay.key].status}
                    <div
                      class="ms-2 status text-success px-2 px-md-3 border border-success"
                    >
                      正常
                    </div>
                  {:else}
                    <div class="ms-2 status bg-danger text-white px-2 px-md-3">
                      異常
                    </div>
                  {/if}
                  <div class="halfmoon ms-2">
                    <HarfmoonChart scale={status[relay.key].health} />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .content {
    /* border-radius: 16px; */
  }
  .status {
    height: 30px;
    /* border: 1px solid #444; */
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  .halfmoon {
    height: 30px;
    /* width: 30px; */
  }
</style>
