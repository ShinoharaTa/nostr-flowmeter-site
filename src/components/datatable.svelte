<script lang="ts">
  import type { ChartDatasets } from "$lib/app";
  import { format, fromUnixTime, isSameDay, isSameHour } from "date-fns";
  export let axis: number[];
  export let data: number[];
  const formatted: any = [];
  const formattedAxis = axis.reverse()
  const formatteddata = data.reverse()
  for (let i = 0; i < formattedAxis.length; i++) {
    const date = fromUnixTime(formattedAxis[i])
    const date_before = fromUnixTime(formattedAxis[i - 1])
    formatted.push({
      date,
      showDate:
        i === 0 || !isSameDay(date, date_before),
      showTime:
        i === 0 ||
        !isSameHour(date, date_before),
      count: formatteddata[i],
    });
  }
</script>

<span>測位情報 (posts / 10min)</span>
<div class="table-container">
  <table>
    <thead class="sticky-top">
      <tr class="bg-sub">
        <th class="text-center">日付</th>
        <th class="text-center">時</th>
        <th class="text-center">分</th>
        <th class="text-center">流速</th>
      </tr>
    </thead>
    <tbody>
      {#each formatted as item}
        <tr>
          <td class:no-border={!item.showDate}
            >{#if item.showDate}{format(item.date, "yyyy/MM/dd")}{/if}</td
          >
          <td class:no-border={!item.showTime}
            >{#if item.showTime}{format(item.date, "HH")}{/if}</td
          >
          <td>{format(item.date, "mm")}</td>
          <td class="text-end no-border-left">{item.count}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    height: 400px;
    overflow-y: scroll;
    font-size: 12px;
    border: 1px solid #000;
  }
  @media (min-width: 768px) {
    .table-container {
      height: 60vh;
    }
  }

  .text-center {
    text-align: center;
  }
  .text-end {
    text-align: end;
  }
  .no-border {
    border-top: none;
  }
  .no-border-left {
    border-left: solid 1px #000;
  }
  table {
    width: 100%;
  }
  td {
    border-top: solid 1px #000;
    padding: 0 6px;
  }
</style>
