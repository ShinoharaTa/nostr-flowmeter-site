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

  const formatted = {
    labels: items.labels,
    datasets: [
      {
        type: "bar",
        label: "投稿数",
        data: items.count,
        backgroundColor: "#58B2DC",
      },
      // {
      //   type: "line",
      //   label: "移動平均",
      //   data: items.movingAvg,
      //   cubicInterpolationMode: "monotone",
      //   borderColor: "#113285",
      //   borderWidth: 1.2,
      //   borderJoinStyle: "none",
      //   pointStyle: false,
      // },
    ],
  };
  const formatted_avg = {
    labels: items.labels,
    datasets: [
      // {
      //   type: "bar",
      //   label: "投稿数",
      //   data: items.count,
      //   backgroundColor: "#58B2DC",
      // },
      {
        type: "line",
        label: "移動平均",
        data: items.movingAvg,
        cubicInterpolationMode: "monotone",
        borderColor: "#113285",
        borderWidth: 1.2,
        borderJoinStyle: "none",
        pointStyle: false,
      },
    ],
  };

  let chartCanvas: any;
  let chartCanvas_avg: any;

  function renderChart() {
    new Chart(chartCanvas, {
      // type: "bar",
      data: formatted,
      options: {
        animation: false,
        responsive: true,
        aspectRatio: 5,
        scales: {
          x: {
            display: false,
            type: "time",
            time: {
              unit: "hour",
            },
            title: {
              display: true,
              text: "計測時間",
            },
          },
          y: {
            title: {
              display: true,
              text: "投稿数",
            },
          },
        },
      },
    });
    new Chart(chartCanvas_avg, {
      // type: "bar",
      data: formatted_avg,
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
            },
            title: {
              display: true,
              text: "計測時間",
            },
          },
          y: {
            title: {
              display: true,
              text: "移動平均",
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

<div class="graph_size">
  <canvas bind:this={chartCanvas} />
</div>
<div>
  <canvas bind:this={chartCanvas_avg} height="" />
</div>

<!-- <Bar
/> -->

<style>
  .graph_size {
    position: relative;
    /* width: 1000px;
    height: 30vh; */
  }
</style>
