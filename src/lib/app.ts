import { getTable } from "nostr-key-value";
import { parse, format, sub, addMinutes } from "date-fns";
import lodash from "lodash";
const { add } = lodash;

const relay = "wss://relay-jp.nostr.wirednet.jp";
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

export type result = string[][];
export type ChartDatasets = ChartData[];
export type ChartData = {
  label: Date;
  movingAvg: number;
  count: number;
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
  const formatted: ChartDatasets = [];

  const currentDate = new Date();
  const pastDate = sub(currentDate, { hours: 24 });

  const dates = Array.from({length: 1440}, (_, i) => format(addMinutes(pastDate, i), 'yyyyMMddHHmm'));

  // const dayArray = dates.forEach()
  for (let i = 0; i < values.length; i += chunk) {
    groupedValues.push(values.slice(i, i + chunk));
  }

  groupedValues.forEach((group) => {
    const counts = group.map((item) => Number(item[1]));
    const sum = counts.reduce(add, 0);
    if (formatted.length > movingAvgSize - 1) {
      const movingAvgSum = formatted
        .slice(-(movingAvgSize - 1))
        .map((item) => item.count)
        .reduce(add, 0) + sum;
      console.log(movingAvgSum, sum);
      const movingAvg = movingAvgSum / movingAvgSize;
      formatted.push({
        count: sum,
        label: parse(group[0][0], "yyyyMMddHHmm", new Date()),
        movingAvg: movingAvg,
      });
    } else {
      formatted.push({
        count: sum,
        label: parse(group[0][0], "yyyyMMddHHmm", new Date()),
        movingAvg: NaN,
      });
    }
  });
  console.log(formatted);
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
