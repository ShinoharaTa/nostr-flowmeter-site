import { getTable } from "nostr-key-value";
import { parse, format, addMinutes } from "date-fns";
import lodash from "lodash";
const { add } = lodash;

const relay = "wss://relay-jp.nostr.wirednet.jp";
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

export type GraphData = { [key: string]: number };
export type ChartDatasets = ChartData[];
export type ChartData = {
  label: Date;
  movingAvg: number;
  count: number;
};

export const getGraphData = async (
  tableName: string
): Promise<GraphData | null> => {
  const result = await getTable([relay], npub, tableName);
  if (!result) return null;
  const graphData: GraphData = {};
  for (const item of result.tags.slice(3)) {
    graphData[item[0]] = Number(item[1]);
  }
  return graphData;
};

export const formattedData = (
  values: GraphData,
  chunk: number,
  movingAvgSize: number,
  since: Date
) => {
  const groupedDates: string[][] = [];
  const formatted: ChartDatasets = [];

  const dates = Array.from({ length: 1440 }, (_, i) =>
    format(addMinutes(since, i), "yyyyMMddHHmm")
  );
  for (let i = 0; i < dates.length; i += chunk) {
    groupedDates.push(dates.slice(i, i + chunk));
  }
  groupedDates.forEach((group) => {
    const counts = group.map((item) => Number(values[item] ?? 0));
    const sum = counts.reduce(add, 0);
    if (formatted.length > movingAvgSize - 1) {
      const movingAvgSum =
        formatted
          .slice(-(movingAvgSize - 1))
          .map((item) => item.count)
          .reduce(add, 0) + sum;
      const movingAvg = movingAvgSum / movingAvgSize;
      formatted.push({
        count: sum,
        label: parse(group[0], "yyyyMMddHHmm", new Date()),
        movingAvg: movingAvg,
      });
    } else {
      formatted.push({
        count: sum,
        label: parse(group[0], "yyyyMMddHHmm", new Date()),
        movingAvg: NaN,
      });
    }
  });
  return formatted;
};

export function movingAverage(values: number[], windowSize: number) {
  let movingAverages = [];
  for (let i = 0; i < values.length - windowSize + 1; i++) {
    let windowValues = values.slice(i, i + windowSize);
    let sum = windowValues.reduce((a, b) => a + b, 0);
    movingAverages.push(sum / windowSize);
  }
  return [...Array(windowSize - 1).fill(NaN), ...movingAverages];
}
