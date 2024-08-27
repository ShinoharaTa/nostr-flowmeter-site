import { parse, format, addMinutes } from "date-fns";
import lodash from "lodash";
import {SimplePool} from "nostr-tools"
const { add } = lodash;

const RELAYS = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

const pool = new SimplePool();

export type GraphData = { [key: string]: number };
export type ChartDatasets = ChartData[];
export type ChartData = {
  label: Date;
  movingAvg: number;
  count: number;
};

export const getGraphData = async (
  tableName: string
) => {
  const event = await pool.get(RELAYS, {kinds: [30078] , authors: [npub], "#d": [tableName]});
  if(!event) return null
  const parsedContent = JSON.parse(event.content)
  // console.log(parsedContent)
  return {
    axis: parsedContent.axis,
    data: parsedContent.datas
  }
  // if (!result) return null;
  // const graphData: GraphData = {};
  // for (const item of result.tags.slice(3)) {
  //   graphData[item[0]] = Number(item[1]);
  // }
  // return graphData;
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
