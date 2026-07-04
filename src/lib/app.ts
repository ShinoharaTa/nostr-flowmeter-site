import { SimplePool } from "nostr-tools";

const RELAYS = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

const FETCH_TIMEOUT_MS = 10000;

// 戻り値 null は「該当データなし」、例外は「取得失敗（接続不可・タイムアウト等）」
export const getGraphData = async (tableName: string) => {
  const pool = new SimplePool();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("relay fetch timeout")),
      FETCH_TIMEOUT_MS,
    );
  });
  try {
    const event = await Promise.race([
      pool.get(RELAYS, {
        kinds: [30078],
        authors: [npub],
        "#d": [tableName],
      }),
      timeout,
    ]);
    if (!event) return null;
    const parsedContent = JSON.parse(event.content);
    return {
      axis: parsedContent.axis,
      data: parsedContent.datas,
    };
  } finally {
    clearTimeout(timer);
    pool.close(RELAYS);
  }
};
