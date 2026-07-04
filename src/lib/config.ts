export type RelayStatus = "active" | "discontinued";
export type Relays = RelayItem[];
export type RelayItem = {
  key: string;
  river_name: string;
  relay_url: string;
  live_cam: boolean;
  live_cam_url: string;
  status: RelayStatus;
};

// 流速ちゃん本体（nostr-flowmeter-batch）のリレー一覧と同期して管理する。
// 廃止水系は一覧表示のみ残し、詳細ページへはリンクしない
export const relays: Relays = [
  {
    key: "kirino",
    river_name: "きりの川",
    relay_url: "wss://relay-jp.nostr.wirednet.jp",
    live_cam: true,
    live_cam_url: "https://relay-jp.nostr.wirednet.jp/index.html",
    status: "active",
  },
  {
    key: "yabumi",
    river_name: "やぶみ川",
    relay_url: "wss://yabu.me",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "c-stellar",
    river_name: "かすてら川",
    relay_url: "wss://nrelay-jp.c-stellar.net",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "kojira",
    river_name: "こじら川",
    relay_url: "wss://r.kojira.io",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "kojira_g",
    river_name: "こじら大川",
    relay_url: "wss://x.kojira.io",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "shino3",
    river_name: "しの川",
    relay_url: "wss://relay-jp.shino3.net",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "shino3_g",
    river_name: "しの川(GLOBAL)",
    relay_url: "wss://relay.nostx.io",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "kirino_g",
    river_name: "きりの川(GLOBAL)",
    relay_url: "wss://relay.nostr.wirednet.jp",
    live_cam: false,
    live_cam_url: "",
    status: "active",
  },
  {
    key: "holybea",
    river_name: "ほりべあ川",
    relay_url: "wss://nostr.holybea.com",
    live_cam: false,
    live_cam_url: "",
    status: "discontinued",
  },
  {
    key: "takenoko_g",
    river_name: "のこたろ川(GLOBAL)",
    relay_url: "wss://nostr-relay.nokotaro.com",
    live_cam: false,
    live_cam_url: "",
    status: "discontinued",
  },
];

// 稼働中の観測所のみ返す（廃止水系の詳細ページは 404 にする）
export const getRelay = (key: string): RelayItem | undefined => {
  return relays.find((item) => item.key === key && item.status === "active");
};

// 流速水準（官公庁の水位基準風、単位: posts/10min）。プレビュー後に調整可
export type FlowLevels = {
  attention: number;
  danger: number;
};

export const FLOW_LEVELS: FlowLevels = {
  attention: 100,
  danger: 200,
};

// トップページの「お知らせ」欄（新しいものを先頭に）
export type Notice = {
  date: string;
  text: string;
  url?: string;
};

export const notices: Notice[] = [
  {
    date: "2026-07-04",
    text: "当観測所は https://nostr-flowmeter.shino3.net/ へ移転しました。",
  },
];
