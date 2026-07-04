# nostr-flowmeter-site

Nostr 日本リレーの流速(投稿数)を、官公庁の水位観測サイト風のデザインで表示する SvelteKit サイト。
「野洲田川定点観測所」。流速ちゃん(bot)が毎分計測して NIP-78 (Kind 30078) に投稿したデータをリレーから取得して表示する。

## 開発フロー(必須)

1. 変更すべきポイントを見つけたら、**まず GitHub Issue を起票する**(勝手に実装しない)
   - 日本語で「問題 / 対応案 / 決めたいこと」の構成
   - `gh issue create` を使用。ラベルは bug / enhancement を適宜付与
2. **対応方針が決まった Issue だけ実装する**
3. 実装はブランチを切って行い、**`develop` ブランチ宛に PR を発行する**(`gh pr create --base develop`)
   - PR には対応する Issue 番号を紐付ける(`Closes #N`)
   - `main` への直コミット・直 PR はしない

## コマンド

- `npm run dev` — 開発サーバー(--host 0.0.0.0)
- `npm run build` / `npm run preview` — 本番ビルド / プレビュー
- `npm run check` — svelte-check(型チェック)
- `npm run lint` — Biome(ESLint は廃止済み。偽物の `biome` パッケージを入れないこと。正規は `@biomejs/biome`)

## 技術スタック

- Svelte 5 / SvelteKit 2 / Vite 7 / TypeScript / Biome 2
- Chart.js 4 + chartjs-adapter-date-fns / date-fns 4 / nostr-tools 2
- スタイル: Bootstrap(`static/bootstrap.min.css` 同梱) + `src/styles/style.scss`
- デプロイ: Vercel(adapter-auto)。将来 Cloudflare Workers での SSR を検討中(#13)

## 構造メモ

- `src/lib/config.ts` — 観測所(リレー)一覧。河川名 ⇔ リレー URL の対応表
- `src/lib/app.ts` — Nostr からのデータ取得(SimplePool で Kind 30078 を get)
- `src/routes/[relay]/+page.svelte` — 観測所ページ。`?d=yyyyMMdd` で過去ログ表示
- `src/components/` — charts(棒グラフ)/ datatable(観測値表)/ baseinfo(観測所諸元)。harfmoon-chart / health-chart は現在未使用

## 注意点

- 官公庁の水位情報サイト風のレトロなテーブルデザインは**意図的なもの**。モダンな見た目への「改善」提案はしない
- Svelte 5 は HTML 構造を厳密に検証する(`<table>` 直下の `<tr>` 禁止、`<div />` 等の自己終了タグ禁止)。ビルドエラーになる
- Biome は .svelte のテンプレートを解析しないため、.svelte では noUnusedImports / noUnusedVariables を無効化している(biome.json の overrides)。自動修正で import を消さないこと
- サイト名は「野**洲**田川」(「野州田川」は誤字。#9 参照)
