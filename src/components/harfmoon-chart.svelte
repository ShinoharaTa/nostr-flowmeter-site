<script lang="ts">
  import { Chart, DoughnutController, ArcElement } from "chart.js";
  Chart.register(DoughnutController, ArcElement);
  import "chartjs-adapter-date-fns";
  import { onMount } from "svelte";
  export let scale: number;

  let color = "#198754";
  if (scale <= 40) color = "#ffc107";
  if (scale <= 10) color = "#dc3545";
  let chartCanvas: any;

  function renderChart() {
    new Chart(chartCanvas, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [scale, 100 - scale],
            backgroundColor: [color, "#666"], // 塗りつぶしの色を設定します。
          },
        ],
      },
      options: {
        // rotation: 180,
        rotation: 225,
        circumference: 270,
        cutout: "55%",
        borderColor: "#0000",
        animation: false,
        layout: {
          padding: 0,
        },
      },
    });
  }

  onMount(() => {
    renderChart();
  });
</script>

<canvas bind:this={chartCanvas} class="img-fluid" />

<style>
</style>
