<script lang="ts">
import { browser } from "$app/environment";
import { relays } from "$lib/config";

const NEW_SITE_URL = "https://nostr-flowmeter.shino3.net/";
// 旧 Vercel URL で閲覧しているときだけ移転案内を表示する
const showMigrationNotice =
  browser && location.hostname.endsWith(".vercel.app");
</script>

<div class="bg-main text-center py-2">
  <div class="fs-1">野洲田川水系 定点観測所</div>
  <div class="fs-5">―リアルタイム流速情報―</div>
</div>
{#if showMigrationNotice}
  <div class="max-width mx-auto px-3">
    <div class="migration-notice mt-3 p-3 text-center">
      <div class="fs-4 text-danger">移転のお知らせ</div>
      <div class="mt-2">
        野洲田川定点観測所は下記のURLへ移転しました。<br />
        お手数ですが、ブックマーク等の変更をお願いいたします。
      </div>
      <div class="fs-5 mt-2">
        新URL: <a href={NEW_SITE_URL} class="text-primary">{NEW_SITE_URL}</a>
      </div>
    </div>
  </div>
{/if}
<div class="max-width mx-auto container pt-3">
<div class="row">
  <div class="col-12">
    このサイトは Nostr 日本リレーの流速をグラフ表示化しています。<br />
    流速ちゃんがリレー上に投稿したKind 30078 をデータベースとしたシステムで、nostr-key-value
    プロジェクトのサンプルとしても提供されています。<br />

    <br />
    サイト管理者:
    <a
      href="https://nostx.shino3.net/npub1l60d6h2uvdwa9yq0r7r2suhgrnsadcst6nsx2j03xwhxhu2cjyascejxe5"
      target="_blank" rel="noopener noreferrer"
      class="text-success">shino3（しのさん）</a
    ><br />
    ページソース・質問・お問い合わせ:
    <a
      href="https://github.com/ShinoharaTa/nostr-flowmeter-site"
      target="_blank" rel="noopener noreferrer">GitHub</a
    >
  </div>
  <div class="col-md-9">
    <table class="mt-3">
      <thead>
        <tr class="bg-sub">
          <th>河川名</th>
          <th>URI</th>
        </tr>
      </thead>
      <tbody>
        {#each relays as relay}
          <tr>
            <td class="py-md-3">
              <a href="/{relay.key}" class="text-primary">{relay.river_name}</a>
            </td>
            <td class="uri-cell">
              {relay.relay_url}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="col-md-3">
    <table class="mt-3">
      <thead>
        <tr class="bg-sub">
          <th>観測システム</th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td
          ><img
            src="/image/ryusoku-chan.jpg"
            alt="流速ちゃんのイラスト"
            class="img-fluid"
          /></td
        >
      </tr>
      <tr>
        <td
          ><a
            href="https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv"
            target="_blank" rel="noopener noreferrer"
            class="text-success">流速ちゃん</a
          ></td
        >
      </tr>
      <tr>
        <td
          >日本リレーの流速を毎分計測します。<br />計測したデータはNIP-78 (Kind:
          30078) に投稿され、記録されていきます。<br /></td
        >
      </tr>
      <tr>
        <td
          >Illust by <a
            href="https://nostx.shino3.net/npub1tuqsl6l8xzly95vv80um7wsnt7gxy8w9wgt4khp4wyv4xwhfw44slm93e9"
            target="_blank" rel="noopener noreferrer">© りら</a
          ></td
        >
      </tr>
      </tbody>
    </table>
  </div>
  <div class="col-12 mt-4">
    <div class="h5">野洲田川水系 河川構成図</div>
    <div><img src="/image/river_image.png" alt="野洲田川水系 河川構成図" class="img-fluid" /></div>
    <div class="text-center">
      Illust by <a
        href="https://nostx.shino3.net/npub1e4qg56wvd3ehegd8dm7rlgj8cm998myq0ah8e9t5zeqkg7t7s93q750p76"
        target="_blank" rel="noopener noreferrer">© あわゆき</a
      >
    </div>
  </div>
  <div class="p-4"></div>
</div>
</div>

<style>
  .migration-notice {
    border: 2px solid #dc3545;
    background-color: #fff;
  }
  table {
    width: 100%;
    border: 1px solid #000;
  }
  td,
  th {
    padding: 5px 7px;
    border: 1px solid #000;
    text-align: center;
    height: 1.5rem;
  }
  .uri-cell {
    word-break: break-all;
  }
  /* モバイルでは大見出しを一段階（fs-2 相当に）縮小する */
  @media (max-width: 575.98px) {
    .fs-1 {
      font-size: calc(1.325rem + 0.9vw) !important;
    }
  }
</style>
