<script lang="ts">
  import type { ChartDatasets } from "$lib/app";
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    TimeScale,
    type ChartData,
  } from "chart.js";
  import "chartjs-adapter-date-fns";
  import { format, fromUnixTime } from "date-fns";
  import { onMount } from "svelte";
  export let axis: number[];
  export let data: number[];

  const formatted = {
    labels: axis.map((item) => fromUnixTime(item)),
    datasets: [
      // {
      //   type: "line",
      //   label: "移動平均",
      //   data: items.map((item) => item.movingAvg),
      //   cubicInterpolationMode: "monotone",
      //   borderColor: "#113285",
      //   borderWidth: 1.2,
      //   borderJoinStyle: "none",
      //   pointStyle: false,
      // },
      {
        type: "bar",
        label: "投稿数",
        data: data,
        backgroundColor: "#58B2DC",
      },
    ],
  };

  let chartCanvas: any;
  Chart.register(TimeScale, LinearScale, BarController, BarElement);
  function renderChart() {
    new Chart(chartCanvas, {
      data: formatted,
      options: {
        animation: false,
        responsive: true,
        aspectRatio: 1,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
              displayFormats: {
                hour: "H時",
              },
            },
            title: {
              display: true,
              text: "時刻",
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
</script>

<div class="mx-auto chart_size">
  <canvas bind:this={chartCanvas} class="img-fluid canvas" />
</div>

<style>
  .canvas {
    min-width: 300px;
    min-height: 300px;
    width: 85vw;
    height: 85vw;
  }
  .chart_size {
    min-width: 300px;
    min-height: 300px;
    width: 85vw;
    height: 85vw;
  }
  @media (min-width: 768px) {
    .chart_size {
      width: 100%;
      height: initial;
    }
  }
</style>
