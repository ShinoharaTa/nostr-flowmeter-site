<script lang="ts">
import type { RelayItem } from "$lib/config";
export let info: RelayItem;
export let operation: "計測中" | "欠測" | "過去ログ" = "計測中";

const operationClasses = {
  計測中: "text-success",
  欠測: "text-danger",
  過去ログ: "text-secondary",
} as const;

const systemUrl =
  "https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv";

type SpecRow = {
  label: string;
  value: string;
  link?: string;
  className?: string;
};

$: specRows = [
  { label: "水系名", value: "野洲田川水系" },
  { label: "河川名", value: info.river_name },
  { label: "観測所", value: "野洲田川定点観測所" },
  { label: "所在地", value: info.relay_url },
  { label: "観測項目", value: "流速（投稿数）" },
  { label: "観測方式", value: "テレメータ（自動観測・毎分）" },
  { label: "ライブカメラ", value: info.live_cam ? "○" : "✕" },
  { label: "観測システム", value: "流速ちゃん", link: systemUrl },
  {
    label: "稼働状況",
    value: operation,
    className: operationClasses[operation],
  },
] satisfies SpecRow[];
</script>

<!-- md 以上: 見出し行 + 値行の横並び表 -->
<div class="spec-wide-container">
  <table class="spec-table spec-table-wide">
    <thead>
      <tr class="bg-sub">
        {#each specRows as row}
          <th>{row.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      <tr>
        {#each specRows as row}
          <td class={row.className ?? ""}>
            {#if row.link}
              <a href={row.link} class="text-primary" target="_blank" rel="noopener noreferrer"
                >{row.value}</a
              >
            {:else}
              {row.value}
            {/if}
          </td>
        {/each}
      </tr>
    </tbody>
  </table>
</div>

<!-- md 未満: 「項目 | 値」の2列縦表 -->
<table class="spec-table spec-table-narrow">
  <tbody>
    {#each specRows as row}
      <tr>
        <th class="bg-sub" scope="row">{row.label}</th>
        <td class={row.className ?? ""}>
          {#if row.link}
            <a href={row.link} class="text-primary" target="_blank" rel="noopener noreferrer"
              >{row.value}</a
            >
          {:else}
            {row.value}
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if info.live_cam}
  <div class="text-end mt-2">
    <a href={info.live_cam_url} target="_blank" rel="noopener noreferrer" class="text-danger"
      >ライブカメラで河川の様子をみる</a
    >
  </div>
{/if}

<style>
  .spec-table {
    width: 100%;
    border: 1px solid #000;
  }
  .spec-table td,
  .spec-table th {
    padding: 2px 7px;
    border: 1px solid #000;
    text-align: center;
    height: 1.5rem;
  }
  .spec-wide-container {
    display: none;
  }
  /* 見出しは折り返さず、値セルは折り返して 960px 幅に収める */
  .spec-table-wide th {
    white-space: nowrap;
  }
  .spec-table-wide td {
    word-break: break-all;
  }
  .spec-table-narrow th {
    width: 40%;
    white-space: nowrap;
  }
  .spec-table-narrow td {
    word-break: break-all;
  }
  @media (min-width: 768px) {
    .spec-wide-container {
      display: block;
      overflow-x: auto;
    }
    .spec-table-narrow {
      display: none;
    }
  }
</style>
