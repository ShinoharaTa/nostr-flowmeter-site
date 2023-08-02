<script lang="ts">
  import type { RelayItem } from "$lib/config";
  export let info: RelayItem;
</script>

<table>
  <thead>
    <tr class="bg-sub">
      <th><span>水系名</span></th>
      <th><span>河川名</span></th>
      <th><span>観測所</span></th>
      <th><span>ライブカメラ</span></th>
      <th><span>観測システム</span></th>
      <th><span>稼働状況</span></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span>野洲田川水系</span></td>
      <td><span>{info.river_name}</span></td>
      <td><span>野洲田川定点観測所</span></td>
      <td><span>{info.live_cam ? "○" : "✕"}</span></td>
      <td
        ><span
          ><a
            href="https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv"
            class="text-primary"
            target="_blank">流速ちゃん</a
          ></span
        ></td
      >
      <td class="text-success"><span>計測中</span></td>
    </tr>
  </tbody>
</table>
{#if info.live_cam}
  <div class="text-end mt-2">
    <a href={info.live_cam_url} target="_blank" class="text-danger"
      >ライブカメラで河川の様子をみる</a
    >
  </div>
{/if}

<style>
  table {
    width: 100%;
    border: 1px solid #000;
    writing-mode: vertical-lr;
  }
  @media (min-width: 768px) {
    table {
      -ms-writing-mode: initial;
      writing-mode: initial;
    }
  }
  td,
  th {
    padding: 2px 7px;
    border: 1px solid #000;
    text-align: center;
    height: 1.5rem;
  }
  td > span,
  th > span {
    writing-mode: horizontal-tb;
    white-space: nowrap;
  }
</style>
