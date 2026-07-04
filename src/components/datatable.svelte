<script lang="ts">
import { format, fromUnixTime, isSameDay, isSameHour } from "date-fns";
export let axis: number[];
export let data: number[];
type Row = {
  date: Date;
  showDate: boolean;
  showTime: boolean;
  count: number;
};

function buildRows(axis: number[], data: number[]): Row[] {
  const rows: Row[] = [];
  const reversedAxis = [...axis].reverse();
  const reversedData = [...data].reverse();
  for (let i = 0; i < reversedAxis.length; i++) {
    const date = fromUnixTime(reversedAxis[i]);
    const date_before = fromUnixTime(reversedAxis[i - 1]);
    rows.push({
      date,
      showDate: i === 0 || !isSameDay(date, date_before),
      showTime: i === 0 || !isSameHour(date, date_before),
      count: reversedData[i],
    });
  }
  return rows;
}

$: formatted = buildRows(axis, data);
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
