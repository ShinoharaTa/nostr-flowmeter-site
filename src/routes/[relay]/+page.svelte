<script lang="ts">
import { format, parse } from "date-fns";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { getGraphData } from "$lib/app";
import BaseInfo from "../../components/baseinfo.svelte";
import Charts from "../../components/charts.svelte";
import DataTable from "../../components/datatable.svelte";
import type { PageData } from "./$types";

export let data: PageData;

let axis: number[] | null = null;
let counts: number[] | null = null;
let selectedDate = format(new Date(), "yyyy-MM-dd");
let radioSelection = "0";
let requestId = 0;

$: info = data.info;
$: syncControls(data.date);
$: if (browser && info) fetchData(data.relayKey, data.date);

function syncControls(date: string | null) {
  if (date) {
    selectedDate = format(parse(date, "yyyyMMdd", new Date()), "yyyy-MM-dd");
    radioSelection = "1";
  } else {
    selectedDate = format(new Date(), "yyyy-MM-dd");
    radioSelection = "0";
  }
}

async function fetchData(relayKey: string, date: string | null) {
  const id = ++requestId;
  axis = null;
  counts = null;
  const dateKey = date ? `_${date}` : "";
  const result = await getGraphData(`nostr_river_flowmeter${dateKey}`);
  if (id !== requestId) return;
  if (!result) return;
  axis = result.axis;
  counts = relayKey in result.data ? result.data[relayKey] : [];
}

const update = () => {
  if (radioSelection === "0") {
    goto(`/${data.relayKey}`);
  } else {
    goto(`/${data.relayKey}?d=${format(new Date(), "yyyyMMdd")}`);
  }
};
const selectDate = () => {
  goto(`/${data.relayKey}?d=${format(new Date(selectedDate), "yyyyMMdd")}`);
};
</script>

<div class="text-center bg-main p-2">
  <span class="fs-5"><a href="/" class="text-light">野洲田川定点観測所</a></span
  >
</div>

<div class="bg-light-sub">
  <div
    class="max-width mx-auto d-md-flex justify-content-between align-items-bottom pb-3 container flex-row-reverse"
  >
    <div class="bg-main py-2 px-3 head-sub-title">
      Nostr 日本語リレーリアルタイム流速検出システム
    </div>
    <div class="pt-2">{info?.relay_url ?? ""}</div>
  </div>
</div>
{#if info}
  <div class="bg-light-sub">
    <div
      class="max-width mx-auto d-md-flex justify-content-between align-items-center container flex-row-reverse pt-2"
    >
      <div class="">
        日付を選択：
        <input
          type="date"
          class=""
          bind:value={selectedDate}
          on:change={selectDate}
        />
      </div>
      <div class="select-sector pt-2 pb-1 px-3 bg-white mt-2">
        <label for="realtime" class="me-2">
          <input
            type="radio"
            id="realtime"
            name="choice"
            value="0"
            bind:group={radioSelection}
            on:change={update}
          />
          10分計測
        </label>
        <label for="minute_10">
          <input
            type="radio"
            id="minute_10"
            name="choice"
            value="1"
            bind:group={radioSelection}
            on:change={update}
          />
          正時刻
        </label>
      </div>
    </div>
  </div>
{/if}
<div class="p-2"></div>

{#if axis && counts && info}
  <div class="max-width mx-auto container">
    <BaseInfo {info} />
  </div>
  <div class="p-2"></div>
  <div class="row max-width mx-auto">
    <div class="col-12 col-md-3 order-2">
      <DataTable {axis} data={counts} />
    </div>
    <div class="col-12 col-md-9 order-1">
      <Charts {axis} data={counts} />
    </div>
  </div>
{:else if info}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1"></div>
    <div class="fs-3">Now loading...</div>
    <div class="mt-4">読み込み中</div>
  </div>
{:else}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1">404</div>
    <div class="fs-3">Not Found</div>
    <div class="mt-4">ページが見つかりません</div>
  </div>
{/if}

<style>
  a {
    text-decoration: none;
  }
  .select-sector {
    border-radius: 10px 10px 0 0;
  }
  .select-sector input {
    vertical-align: middle;
  }
  input[type="radio"] {
    display: initial;
  }
  .head-sub-title {
    border-radius: 0 0 10px 10px;
  }
</style>
