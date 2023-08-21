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
    labels: items.map((item) => item.label),
    datasets: [
      {
        type: "line",
        label: "移動平均",
        data: items.map((item) => item.movingAvg),
        cubicInterpolationMode: "monotone",
        borderColor: "#113285",
        borderWidth: 1.2,
        borderJoinStyle: "none",
        pointStyle: false,
      },
      {
        type: "bar",
        label: "投稿数",
        data: items.map((item) => item.count),
        backgroundColor: "#58B2DC",
      },
    ],
  };

  let chartCanvas: any;

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

<div>
  <canvas bind:this={chartCanvas} class="img-fluid"/>
</div>

<style>
</style>
