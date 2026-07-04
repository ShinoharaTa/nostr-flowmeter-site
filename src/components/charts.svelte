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
import { FLOW_LEVELS } from "$lib/config";
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

// 流速水準線(ツールチップには表示しない)
const LEVEL_LINE_LABELS = ["流速注意水準", "氾濫危険水準"];

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
      type: "line" as const,
      label: "流速注意水準",
      data: axis.map(() => FLOW_LEVELS.attention),
      borderColor: "#d4a017",
      borderWidth: 1.5,
      pointStyle: false as const,
    },
    {
      type: "line" as const,
      label: "氾濫危険水準",
      data: axis.map(() => FLOW_LEVELS.danger),
      borderColor: "#dc3545",
      borderWidth: 1.5,
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
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          filter: (item) =>
            !LEVEL_LINE_LABELS.includes(item.dataset.label ?? ""),
        },
      },
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
          suggestedMax: FLOW_LEVELS.danger * 1.1,
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
  <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
  .chart_size {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
  }
  @media (max-width: 767px) {
    .chart_size {
      aspect-ratio: 4 / 3;
    }
  }
</style>
