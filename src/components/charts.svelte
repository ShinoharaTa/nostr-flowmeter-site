<script lang="ts">
import {
  BarController,
  BarElement,
  Chart,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { fromUnixTime } from "date-fns";
import { onDestroy, onMount } from "svelte";
export let axis: number[];
export let data: number[];

Chart.register(TimeScale, LinearScale, BarController, BarElement);

let chartCanvas: HTMLCanvasElement;
let chart: Chart | undefined;

const buildChartData = (axis: number[], data: number[]) => ({
  labels: axis.map((item) => fromUnixTime(item)),
  datasets: [
    {
      type: "bar" as const,
      label: "投稿数",
      data: data,
      backgroundColor: "#58B2DC",
    },
  ],
});

$: if (chart) {
  chart.data = buildChartData(axis, data);
  chart.update();
}

onMount(() => {
  chart = new Chart(chartCanvas, {
    data: buildChartData(axis, data),
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
});

onDestroy(() => {
  chart?.destroy();
  chart = undefined;
});
</script>

<div class="mx-auto chart_size">
  <canvas bind:this={chartCanvas} class="img-fluid canvas"></canvas>
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
