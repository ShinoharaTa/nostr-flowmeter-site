<script lang="ts">
import { format, parse } from "date-fns";
import { onDestroy, onMount } from "svelte";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { getGraphData } from "$lib/app";
import BaseInfo from "../../components/baseinfo.svelte";
import Charts from "../../components/charts.svelte";
import DataTable from "../../components/datatable.svelte";
import type { PageData } from "./$types";

export let data: PageData;

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const MISSING_THRESHOLD_SEC = 30 * 60;

type Operation = "計測中" | "欠測" | "過去ログ";

let axis: number[] | null = null;
let counts: number[] | null = null;
let status: "loading" | "ready" | "nodata" | "error" = "loading";
let selectedDate = format(new Date(), "yyyy-MM-dd");
let radioSelection = "0";
let requestId = 0;
let lastUpdated: Date | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let operation: Operation = "計測中";

$: info = data.info;
$: syncControls(data.date);
$: if (browser && info) fetchData(data.relayKey, data.date);
$: if (browser) syncAutoRefresh(data.date);

function syncControls(date: string | null) {
  if (date) {
    selectedDate = format(parse(date, "yyyyMMdd", new Date()), "yyyy-MM-dd");
    radioSelection = "1";
  } else {
    selectedDate = format(new Date(), "yyyy-MM-dd");
    radioSelection = "0";
  }
}

function startAutoRefresh() {
  if (refreshTimer !== null) return;
  refreshTimer = setInterval(() => {
    fetchData(data.relayKey, data.date, true);
  }, REFRESH_INTERVAL_MS);
}

function stopAutoRefresh() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// リアルタイム表示（date が null）のときだけ自動更新する
function syncAutoRefresh(date: string | null) {
  stopAutoRefresh();
  if (date === null && !document.hidden) {
    startAutoRefresh();
  }
}

// タブ非表示中は自動更新を止め、復帰時に即時更新して再開する
function handleVisibilityChange() {
  if (document.hidden) {
    stopAutoRefresh();
  } else if (data.date === null) {
    fetchData(data.relayKey, data.date, true);
    startAutoRefresh();
  }
}

onMount(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onDestroy(() => {
  stopAutoRefresh();
  if (browser) {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }
});

// 最終観測時刻が閾値より古ければ「欠測」、過去ログ表示時は判定しない
function judgeOperation(date: string | null, axisData: number[]): Operation {
  if (date) return "過去ログ";
  if (axisData.length === 0) return "欠測";
  const latest = Math.max(...axisData);
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec - latest > MISSING_THRESHOLD_SEC ? "欠測" : "計測中";
}

// silent: 自動更新用。既存表示を維持したまま裏で取得し、成功時のみ差し替える
async function fetchData(
  relayKey: string,
  date: string | null,
  silent = false,
) {
  const id = ++requestId;
  if (!silent) {
    axis = null;
    counts = null;
    status = "loading";
  }
  const dateKey = date ? `_${date}` : "";
  try {
    const result = await getGraphData(`nostr_river_flowmeter${dateKey}`);
    if (id !== requestId) return;
    if (!result) {
      if (silent) {
        console.error("Auto refresh returned no data");
      } else {
        status = date ? "nodata" : "error";
      }
      return;
    }
    axis = result.axis;
    counts = relayKey in result.data ? result.data[relayKey] : [];
    status = "ready";
    lastUpdated = new Date();
    operation = judgeOperation(date, result.axis);
  } catch (e) {
    if (id !== requestId) return;
    console.error("Failed to fetch graph data:", e);
    if (!silent) {
      status = "error";
    }
  }
}

const update = () => {
  if (radioSelection === "0") {
    goto(`/${data.relayKey}`);
  } else {
    goto(`/${data.relayKey}?d=${format(new Date(), "yyyyMMdd")}`);
  }
};
const selectDate = () => {
  const parsed = parse(selectedDate, "yyyy-MM-dd", new Date());
  goto(`/${data.relayKey}?d=${format(parsed, "yyyyMMdd")}`);
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
    <div class="pt-2">{info.relay_url}</div>
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
        {#if data.date === null && lastUpdated}
          <div class="text-end">最終更新: {format(lastUpdated, "HH:mm")}</div>
        {/if}
      </div>
      <div class="select-sector pt-2 pb-1 px-3 bg-white mt-2">
        <label for="mode-current" class="me-2">
          <input
            type="radio"
            id="mode-current"
            name="choice"
            value="0"
            bind:group={radioSelection}
            on:change={update}
          />
          現在
        </label>
        <label for="mode-date">
          <input
            type="radio"
            id="mode-date"
            name="choice"
            value="1"
            bind:group={radioSelection}
            on:change={update}
          />
          日付指定
        </label>
      </div>
    </div>
  </div>
{/if}
<div class="p-2"></div>

{#if status === "ready" && axis && counts}
  <div class="max-width mx-auto container">
    <BaseInfo {info} {operation} />
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
{:else if status === "nodata"}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1"></div>
    <div class="fs-3">No Data</div>
    <div class="mt-4">指定日の観測データがありません</div>
  </div>
{:else if status === "error"}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1"></div>
    <div class="fs-3">Error</div>
    <div class="mt-4">
      データを取得できませんでした。時間をおいて再読み込みしてください
    </div>
  </div>
{:else}
  <div class="row max-width mx-auto text-center mt-5">
    <div class="fs-1"></div>
    <div class="fs-3">Now loading...</div>
    <div class="mt-4">読み込み中</div>
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
