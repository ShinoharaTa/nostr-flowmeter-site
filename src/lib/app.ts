import { SimplePool } from "nostr-tools";

const RELAYS = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://r.kojira.io",
  "wss://yabu.me",
  "wss://relay-jp.shino3.net",
];
const npub = "a3c13ef4c9eccfde01bd9326a2ab08b2ad7dc57f3b77db77723f8e2ad7ba24d6";

const pool = new SimplePool();

export const getGraphData = async (tableName: string) => {
  const event = await pool.get(RELAYS, {
    kinds: [30078],
    authors: [npub],
    "#d": [tableName],
  });
  if (!event) return null;
  try {
    const parsedContent = JSON.parse(event.content);
    return {
      axis: parsedContent.axis,
      data: parsedContent.datas,
    };
  } catch (e) {
    console.error("Failed to parse event content:", e);
    return null;
  }
};
