<script lang="ts">
  import type { ChartDatasets } from "$lib/app";
  import {
    Chart,
    LineController,
    LineElement,
    BarController,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    type ChartData,
  } from "chart.js";
  Chart.register(
    LineController,
    LineElement,
    BarController,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale
  );
  import "chartjs-adapter-date-fns";
  import { onMount } from "svelte";
  export let items: ChartDatasets;
  // const counts = data.map((item) => Number(item[1]));
  // const movingAvg = movingAverage(counts, 10); // Compute a 3-point moving average

  const formatted = {
    labels: items.labels,
    datasets: [
      {
        label: "Count",
        data: items.count,
        color: "rgb(75, 192, 192)",
      },
      {
        type: "line",
        label: "Count",
        data: items.movingAvg,
      },
    ],
  };

  let chartCanvas: any;

  function renderChart() {
    let chart = new Chart(chartCanvas, {
      type: "bar",
      data: formatted,
      options: {
        scales: {
          x: {
            type: "time",
            // time: {
            //   unit: "minute",
            // },
            title: {
              display: true,
              text: "Time",
            },
          },
          y: {
            title: {
              display: true,
              text: "Count",
            },
          },
        },
      },
    });
  }

  onMount(() => {
    renderChart();
  });
  // data={formatted}
  // options={
</script>

<canvas bind:this={chartCanvas} />

<!-- <Bar
/> -->
