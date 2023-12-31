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
    key: "yabumi",
    river_name: "やぶみ川",
    relay_url: "wss://yabu.me",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "holybea",
    river_name: "ほりべあ川",
    relay_url: "wss://nostr.holybea.com",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "c-stellar",
    river_name: "かすてら川",
    relay_url: "wss://nrelay-jp.c-stellar.net",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "kojira",
    river_name: "こじら川",
    relay_url: "wss://r.kojira.io",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "shino3",
    river_name: "しの川",
    relay_url: "wss://relay-jp.shino3.net",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "takenoko_g",
    river_name: "のこたろ川(GLOBAL)",
    relay_url: "wss://nostr-relay.nokotaro.com",
    live_cam: false,
    live_cam_url: "",
  },
  {
    key: "kirino_g",
    river_name: "きりの川(GLOBAL)",
    relay_url: "wss://relay.nostr.wirednet.jp",
    live_cam: false,
    live_cam_url: "",
  },
];

export const getRelay = (key: string): RelayItem | undefined => {
  return relays.find((item) => item.key === key);
};
