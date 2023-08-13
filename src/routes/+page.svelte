<script lang="ts">
  import { relays } from "$lib/config";
</script>

<!-- {#if items} -->
<div class="bg-main text-center py-2">
  <div class="fs-1">野州田川水系</div>
  <div class="fs-3 mt-2">定点観測所</div>
</div>
<div class="row max-width mx-auto pt-3">
  <div class="col-12">
    このサイトは Nostr 日本リレーの流速をグラフ表示化しています。<br />
    流速ちゃんがリレー上に投稿したKind 30078 をデータベースとしたシステムで、nostr-key-value
    プロジェクトのサンプルとしても提供されています。<br />

    <br />
    サイト管理者:
    <a
      href="https://nostx.shino3.net/npub1l60d6h2uvdwa9yq0r7r2suhgrnsadcst6nsx2j03xwhxhu2cjyascejxe5"
      target="_blank"
      class="text-success">shino3（しのさん）</a
    ><br />
    ページソース・質問・お問い合わせ:
    <a
      href="https://github.com/ShinoharaTa/nostr-flowmeter-site"
      target="_blank">GitHub</a
    >
    <br>
    <br>
    ※ このサイトに掲載されているロゴ・イラストは許諾を得て掲載させていただいております。<br>
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
              <!-- <div class="col-md-6 fs-4 text-md-end text-center py-2"> -->
              <a href="/{relay.key}" class="text-primary">{relay.river_name}</a>
              <!-- </div> -->
            </td>
            <td>
              <!-- <div class="col-md-6 fs-6 text-md-start text-center py-2"> -->
              {relay.relay_url}
              <!-- </div> -->
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="col-md-3">
    <table class="mt-3">
      <tr class="bg-sub">
        <th>観測システム</th>
      </tr>
      <tr>
        <td
          ><img
            src="https://i.gyazo.com/5d38eb6b55fbacfa81f836eb191b1a76.jpg"
            alt=""
            class="img-fluid"
          /></td
        >
      </tr>
      <tr>
        <td
          ><a
            href="https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv"
            target="_blank"
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
            target="_blank">© りら</a
          ></td
        >
      </tr>
    </table>
  </div>
  <!-- <div class="col-12 mt-4">
    <div class="h5">野洲田川水系 河川構成図</div>
    <div><img src="" alt="" class="img-fluid" /></div>
    <div class="text-center">
      Illust by <a
        href="https://nostx.shino3.net/npub1e4qg56wvd3ehegd8dm7rlgj8cm998myq0ah8e9t5zeqkg7t7s93q750p76"
        target="_blank">© あわゆき</a
      >
    </div>
  </div> -->
  <div class="p-4"></div>
</div>

<!-- {/if} -->

<style>
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
</style>
