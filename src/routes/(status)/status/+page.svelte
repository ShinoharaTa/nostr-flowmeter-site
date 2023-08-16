<script lang="ts">
  import { relays } from "$lib/config";
  import { getTable, utilKeyValueArrayToObject } from "nostr-key-value";
  import { onMount } from "svelte";
  import HealthChart from "../../../components/health-chart.svelte";
  import HarfmoonChart from "../../../components/harfmoon-chart.svelte";
  import { format, parse } from "date-fns";

  const status: { [key: string]: any } = {};
  let isLoaded: boolean = false;
  let updated_at: Date;
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
      updated_at = parse(<string>temp.updated_at, "yyyyMMddHHmm", new Date());
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
    <div class="p-2 max-width mx-auto">
      <div class="row g-1">
        <div class="col d-flex">
          <div class="content px-2">
            <div class="fs-3 my-1">野洲田川水系最新ステータス</div>
            <div class="my-1">
              最終取得日時: {format(updated_at, "yyyy/MM/dd HH:mm")}
            </div>
          </div>
          <div class="stripe flex-fill ms-1" />
        </div>
        <div class="col-12 col-sm-4 col-md-3">
          <div class="content p-2 fs-1">
            <div class="text-center">
              {format(new Date(), "HH:mm")}
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-3 order-lg-last">
          <div class="p-4 content">
            <div class="row align-items-center">
              <div class="col-4 col-lg-12">
                <HarfmoonChart {scale} />
              </div>
              <div class="col-8 col-lg-12">
                <div class="fs-5 text-lg-center">
                  健康度: {scale} %
                </div>
                <!-- <div class="fs-5 text-lg-center">
                  最終取得: {updated_at}
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-9 order-1">
          <div class="px-2 content">
            {#each relays as relay}
              <div class="align-items-center d-md-flex my-2 status_head">
                <div class="fs-5 flex-fill mb-2 mb-md-0">
                  {relay.relay_url}
                </div>
                <div class="d-flex fs-5">
                  <HealthChart items={status[relay.key].count} />
                  {#if status[relay.key].status}
                    <div class="ms-1 status bg-dark text-success">正常</div>
                    <div class="ms-1 status bg-dark disabled">異常</div>
                  {:else}
                    <div class="ms-1 status bg-dark disabled">正常</div>
                    <div class="ms-1 status bg-danger">異常</div>
                  {/if}
                  <div class="halfmoon ms-1">
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
    border: 1px solid #888;
    height: 100%;
  }
  .status {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
  }

  .disabled {
    color: #888;
    /* border: 1px solid #888; */
  }

  .halfmoon {
    height: 30px;
    /* width: 30px; */
  }

  .status_head {
    border-left: 10px solid #888;
    padding-left: 10px;
  }

  .stripe {
    background: repeating-linear-gradient(
      -45deg,
      #fff,
      #fff 25px,
      #000 25px,
      #000 50px
    );
  }
</style>
