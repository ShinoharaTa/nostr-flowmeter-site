<script lang="ts">
import { format, fromUnixTime } from "date-fns";
import { browser } from "$app/environment";
import { getGraphData } from "$lib/app";
import { FLOW_LEVELS, notices, relays } from "$lib/config";

const NEW_SITE_URL = "https://nostr-flowmeter.shino3.net/";
// 旧 Vercel URL で閲覧しているときだけ移転案内を表示する
const showMigrationNotice =
  browser && location.hostname.endsWith(".vercel.app");

const MISSING_THRESHOLD_SEC = 30 * 60;

type CurrentInfo = {
  count: number | null;
  updated: Date | null;
  operation: "計測中" | "欠測" | "－";
};

let current: Record<string, CurrentInfo> = {};
let fetchState: "loading" | "ready" | "error" = "loading";

// 全観測所の現在値は単一イベントに含まれるため、取得は1回で済む
async function fetchCurrent() {
  try {
    const result = await getGraphData("nostr_river_flowmeter");
    if (!result) {
      fetchState = "error";
      return;
    }
    const axis: number[] = result.axis;
    const latestTime = axis.length > 0 ? axis[axis.length - 1] : null;
    const nowSec = Math.floor(Date.now() / 1000);
    const map: Record<string, CurrentInfo> = {};
    for (const relay of relays) {
      const series: number[] | undefined = result.data[relay.key];
      if (!series || series.length === 0 || latestTime === null) {
        map[relay.key] = { count: null, updated: null, operation: "－" };
        continue;
      }
      map[relay.key] = {
        count: series[series.length - 1],
        updated: fromUnixTime(latestTime),
        operation:
          nowSec - latestTime > MISSING_THRESHOLD_SEC ? "欠測" : "計測中",
      };
    }
    current = map;
    fetchState = "ready";
  } catch (e) {
    console.error("Failed to fetch current data:", e);
    fetchState = "error";
  }
}

if (browser) fetchCurrent();

const countClass = (count: number | null): string => {
  if (count === null) return "";
  if (count >= FLOW_LEVELS.danger) return "cell-danger";
  if (count >= FLOW_LEVELS.attention) return "cell-attention";
  return "";
};
</script>

<div class="bg-main text-center py-2">
  <div class="fs-1">野洲田川水系 定点観測所</div>
  <div class="fs-5">―リアルタイム流速情報―</div>
</div>
{#if showMigrationNotice}
  <div class="max-width mx-auto px-3">
    <div class="migration-notice mt-3 p-3 text-center">
      <div class="fs-4 text-danger">移転のお知らせ</div>
      <div class="mt-2">
        野洲田川定点観測所は下記のURLへ移転しました。<br />
        お手数ですが、ブックマーク等の変更をお願いいたします。
      </div>
      <div class="fs-5 mt-2">
        新URL: <a href={NEW_SITE_URL} class="text-primary">{NEW_SITE_URL}</a>
      </div>
    </div>
  </div>
{/if}
<div class="max-width mx-auto container pt-3">
  <!-- お知らせ -->
  <div class="section-title">お知らせ</div>
  <table class="notice-table">
    <tbody>
      {#each notices as notice}
        <tr>
          <td class="notice-date">{notice.date}</td>
          <td class="text-start">
            {#if notice.url}
              <a href={notice.url}>{notice.text}</a>
            {:else}
              {notice.text}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- 観測所一覧（現在値） -->
  <div class="d-flex justify-content-between align-items-end mt-4">
    <div class="section-title">観測所一覧</div>
    <div class="table-note">(流速の単位: 投稿/10分)</div>
  </div>
  <table class="obs-table">
    <thead>
      <tr class="bg-sub">
        <th>河川名</th>
        <th class="d-none d-md-table-cell">所在地（リレー）</th>
        <th>現在の流速</th>
        <th>稼働状況</th>
        <th>更新時刻</th>
      </tr>
    </thead>
    <tbody>
      {#each relays as relay}
        {@const info = current[relay.key]}
        <tr>
          <td class="py-md-2">
            {#if relay.status === "active"}
              <a href="/{relay.key}" class="text-primary">{relay.river_name}</a>
            {:else}
              <span class="text-secondary">{relay.river_name}</span>
            {/if}
          </td>
          <td class="uri-cell d-none d-md-table-cell">{relay.relay_url}</td>
          {#if relay.status === "discontinued"}
            <td>-</td>
            <td class="text-secondary">廃止</td>
            <td>-</td>
          {:else if fetchState === "loading"}
            <td class="text-secondary">取得中</td>
            <td class="text-secondary">取得中</td>
            <td class="text-secondary">-</td>
          {:else if info && info.count !== null}
            <td class={countClass(info.count)}>{info.count}</td>
            <td
              class={info.operation === "計測中"
                ? "text-success"
                : "text-danger"}>{info.operation}</td
            >
            <td>{info.updated ? format(info.updated, "HH:mm") : "-"}</td>
          {:else}
            <td>-</td>
            <td>－</td>
            <td>-</td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
  {#if fetchState === "error"}
    <div class="data-note mt-1">
      現在値を取得できませんでした。時間をおいて再読み込みしてください。
    </div>
  {/if}
  <div class="data-note mt-1">
    このデータは速報値であり、後日修正されることがあります。各観測所名から詳細のグラフ・観測値を確認できます。
  </div>

  <!-- 水系図 -->
  <div class="section-title mt-4">野洲田川水系 水系図</div>
  <div class="river-map mx-auto mt-2">
    <img
      src="/image/river_image.png"
      alt="野洲田川水系 河川構成図"
      class="img-fluid"
    />
    <div class="text-center credit">
      Illust by <a
        href="https://nostx.shino3.net/npub1e4qg56wvd3ehegd8dm7rlgj8cm998myq0ah8e9t5zeqkg7t7s93q750p76"
        target="_blank"
        rel="noopener noreferrer">© あわゆき</a
      >
    </div>
  </div>

  <!-- 本システムについて -->
  <div class="section-title mt-4">本システムについて</div>
  <div class="row">
    <div class="col-md-8 pt-2">
      このサイトは Nostr 日本リレーの流速をグラフ表示化しています。<br />
      流速ちゃんがリレー上に投稿したKind 30078 をデータベースとしたシステムで、nostr-key-value
      プロジェクトのサンプルとしても提供されています。<br />
      <br />
      サイト管理者:
      <a
        href="https://nostx.shino3.net/npub1l60d6h2uvdwa9yq0r7r2suhgrnsadcst6nsx2j03xwhxhu2cjyascejxe5"
        target="_blank"
        rel="noopener noreferrer"
        class="text-success">shino3（しのさん）</a
      ><br />
      ページソース・質問・お問い合わせ:
      <a
        href="https://github.com/ShinoharaTa/nostr-flowmeter-site"
        target="_blank"
        rel="noopener noreferrer">GitHub</a
      >
    </div>
    <div class="col-md-4">
      <table class="mt-2">
        <thead>
          <tr class="bg-sub">
            <th>観測システム</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              ><img
                src="/image/ryusoku-chan.jpg"
                alt="流速ちゃんのイラスト"
                class="img-fluid system-image"
              /></td
            >
          </tr>
          <tr>
            <td
              ><a
                href="https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv"
                target="_blank"
                rel="noopener noreferrer"
                class="text-success">流速ちゃん</a
              ></td
            >
          </tr>
          <tr>
            <td
              >日本リレーの流速を毎分計測します。<br />計測したデータはNIP-78
              (Kind: 30078) に投稿され、記録されていきます。<br /></td
            >
          </tr>
          <tr>
            <td
              >Illust by <a
                href="https://nostx.shino3.net/npub1tuqsl6l8xzly95vv80um7wsnt7gxy8w9wgt4khp4wyv4xwhfw44slm93e9"
                target="_blank"
                rel="noopener noreferrer">© りら</a
              ></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="p-4"></div>
</div>

<style>
  .migration-notice {
    border: 2px solid #dc3545;
    background-color: #fff;
  }
  .section-title {
    font-size: 15px;
    font-weight: bold;
    border-left: 5px solid #0b346e;
    border-bottom: 1px solid #0b346e;
    padding: 2px 8px;
  }
  table {
    width: 100%;
    border: 1px solid #000;
    margin-top: 0.5rem;
  }
  td,
  th {
    padding: 5px 7px;
    border: 1px solid #000;
    text-align: center;
    height: 1.5rem;
  }
  .notice-table td {
    text-align: left;
  }
  .notice-date {
    width: 7em;
    white-space: nowrap;
    text-align: center !important;
  }
  .table-note {
    font-size: 11px;
    color: #666;
  }
  .data-note {
    font-size: 11px;
    color: #666;
  }
  .cell-attention {
    background-color: #fff3cd;
  }
  .cell-danger {
    background-color: #f8d7da;
  }
  .uri-cell {
    word-break: break-all;
  }
  .river-map {
    max-width: 640px;
  }
  .credit {
    font-size: 11px;
  }
  .system-image {
    max-width: 200px;
  }
  /* モバイルでは大見出しを一段階（fs-2 相当に）縮小する */
  @media (max-width: 575.98px) {
    .fs-1 {
      font-size: calc(1.325rem + 0.9vw) !important;
    }
  }
  /* モバイルの観測所一覧: 見出しの縦折れを防ぐ */
  @media (max-width: 767.98px) {
    .obs-table th {
      white-space: nowrap;
      font-size: 12px;
      padding: 5px 4px;
    }
    .obs-table td {
      padding: 5px 4px;
    }
  }
</style>
