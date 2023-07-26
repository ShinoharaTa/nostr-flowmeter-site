import { getTable } from "nostr-key-value";
import { parse } from "date-fns";
import lodash from "lodash";
const { add } = lodash;

const relay = "wss://relay-jp.nostr.wirednet.jp";
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

export type result = string[][];
export type ChartDatasets = {
  labels: Date[];
  movingAvg: number[];
  count: number[];
};

export const getGraphData = async (
  tableName: string
): Promise<result | null> => {
  const result = await getTable([relay], npub, tableName);
  if (!result) return null;
  return result.tags.slice(3);
};

export const formattedData = (
  values: result,
  chunk: number,
  movingAvgSize: number
) => {
  const groupedValues: string[][][] = [];
  const formatted: ChartDatasets = {
    labels: [],
    movingAvg: [],
    count: [],
  };

  // Group the data
  for (let i = 0; i < values.length; i += chunk) {
    groupedValues.push(values.slice(i, i + chunk));
  }

  groupedValues.forEach((group) => {
    const counts = group.map((item) => Number(item[1]));
    const sum = counts.reduce(add, 0);
    formatted.count.push(sum);
    formatted.labels.push(parse(group[0][0], "yyyyMMddHHmm", new Date()));

    // Compute the moving average
    if (formatted.count.length >= movingAvgSize) {
      const movingAvgSum = formatted.count
        .slice(-movingAvgSize)
        .reduce((a, b) => a + b, 0);
      const movingAvg = movingAvgSum / movingAvgSize;
      formatted.movingAvg.push(movingAvg);
    } else {
      formatted.movingAvg.push(sum);
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
