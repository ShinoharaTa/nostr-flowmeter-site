<script lang="ts">
import {
  BarController,
  BarElement,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { fromUnixTime } from "date-fns";
import { onDestroy, onMount } from "svelte";
export let axis: number[];
export let data: number[];

Chart.register(
  TimeScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

let chartCanvas: HTMLCanvasElement;
let chart: Chart | undefined;

// 6点(=1時間)移動平均。窓が埋まらない先頭5点は NaN にして描画しない
const MOVING_AVERAGE_WINDOW = 6;
const movingAverage = (values: number[], windowSize: number): number[] =>
  values.map((_, index) => {
    if (index < windowSize - 1) return Number.NaN;
    let sum = 0;
    for (let i = index - windowSize + 1; i <= index; i++) {
      sum += values[i];
    }
    return sum / windowSize;
  });

const buildChartData = (axis: number[], data: number[]) => ({
  labels: axis.map((item) => fromUnixTime(item)),
  datasets: [
    {
      type: "line" as const,
      label: "移動平均",
      data: movingAverage(data, MOVING_AVERAGE_WINDOW),
      cubicInterpolationMode: "monotone" as const,
      borderColor: "#113285",
      borderWidth: 1.2,
      pointStyle: false as const,
    },
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
            text: "投稿数 (posts/10min)",
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
