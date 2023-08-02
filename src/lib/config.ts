export type Relays = RelayItem[];
export type RelayItem = {
  key: string;
  river_name: string;
  relay_url: string;
  live_cam: boolean;
  live_cam_url: string;
};

export const relays: Relays = [
  {
    key: "kirino",
    river_name: "きりの川",
    relay_url: "wss://relay-jp.nostr.wirednet.jp",
    live_cam: true,
    live_cam_url: "https://relay-jp.nostr.wirednet.jp/index.html",
  },
  {
    key: "kojira",
    river_name: "こじら川",
    relay_url: "wss://r.kojira.io",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "yabumi",
    river_name: "やぶみ川",
    relay_url: "wss://yabu.me",
    live_cam: false,
    live_cam_url: "",
  },
];

export const getRelay = (key: string): RelayItem | undefined => {
  return relays.find((item) => item.key === key);
};
