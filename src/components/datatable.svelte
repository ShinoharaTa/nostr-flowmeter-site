<script lang="ts">
  export let items: ChartDatasets;
  import { format, isSameDay, isSameHour } from "date-fns";
  const formatted = [];
  const sortedItems = {
    labels: items.labels.reverse(),
    count: items.count.reverse(),
  };
  for (const i in sortedItems.labels) {
    formatted.push({
      date: sortedItems.labels[i],
      showDate:
        i === 0 || !isSameDay(sortedItems.labels[i], sortedItems.labels[i - 1]),
      showTime:
        i === 0 ||
        !isSameHour(sortedItems.labels[i], sortedItems.labels[i - 1]),
      count: sortedItems.count[i],
    });
  }
  console.log(formatted);
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
    max-height: 60vh;
    overflow-y: scroll;
    font-size: 12px;
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
    /* border-collapse: collapse; */
  }
  th,
  td {
    border-top: solid 1px #000;
    padding: 0 6px;
  }
</style>
