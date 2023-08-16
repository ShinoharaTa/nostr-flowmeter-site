<script lang="ts">
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
  export let items: number[];

  let chartCanvas: any;

  function renderChart() {
    new Chart(chartCanvas, {
      data: {
        labels: Array(10).fill(""),
        datasets: [
          {
            type: "line",
            data: items,
            borderColor: "#198754",
            fill: true,
            backgroundColor: "#198754",
            borderWidth: 1.5,
            pointStyle: false,
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        aspectRatio: 6,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  onMount(() => {
    renderChart();
  });
</script>

<div class="graph bg-dark">
  <canvas bind:this={chartCanvas} class="img-fluid" />
</div>

<style>
  .graph {
    width: 180px;
    height: 30px;
  }
</style>
