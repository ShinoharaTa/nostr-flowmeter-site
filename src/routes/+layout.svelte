<script lang="ts">
import "../styles/style.scss";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { page } from "$app/stores";
import { getRelay } from "$lib/config";

$: river_name = $page.params.relay
  ? "（" + getRelay($page.params.relay)?.river_name + "）"
  : "";

type FontSize = "small" | "normal" | "large";

const FONT_SIZE_KEY = "fontSize";
let fontSize: FontSize = "normal";

function applyFontSize(size: FontSize): void {
  if (!browser) return;
  document.body.classList.remove("fs-small", "fs-large");
  if (size === "small") document.body.classList.add("fs-small");
  if (size === "large") document.body.classList.add("fs-large");
}

function setFontSize(size: FontSize): void {
  if (!browser) return;
  fontSize = size;
  applyFontSize(size);
  try {
    localStorage.setItem(FONT_SIZE_KEY, size);
  } catch {
    // localStorage が使えない環境では保存しない
  }
}

function printPage(): void {
  if (!browser) return;
  window.print();
}

onMount(() => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(FONT_SIZE_KEY);
  } catch {
    saved = null;
  }
  if (saved === "small" || saved === "normal" || saved === "large") {
    fontSize = saved;
    applyFontSize(saved);
  }
});
</script>

<svelte:head>
  <title>野洲田川定点観測所{river_name}</title>
  <meta name="description" content="Nostr{river_name}リレーの流速を表示します">
  <meta property="og:title" content="野洲田川定点観測所{river_name}">
  <meta property="og:description" content="Nostr{river_name}リレーの流速を表示します">
  <meta property="og:type" content="website">
  <meta property="og:url" content={$page.url.href}>
  <meta name="twitter:card" content="summary">
</svelte:head>

<div class="utility-bar">
  <div class="utility-bar-inner max-width">
    <span class="utility-label">文字サイズ:</span>
    <button
      type="button"
      class="utility-btn"
      class:active={fontSize === "small"}
      on:click={() => setFontSize("small")}>小</button
    >
    <span class="utility-sep">|</span>
    <button
      type="button"
      class="utility-btn"
      class:active={fontSize === "normal"}
      on:click={() => setFontSize("normal")}>標準</button
    >
    <span class="utility-sep">|</span>
    <button
      type="button"
      class="utility-btn"
      class:active={fontSize === "large"}
      on:click={() => setFontSize("large")}>大</button
    >
    <button type="button" class="utility-btn utility-print" on:click={printPage}
      >印刷用表示</button
    >
  </div>
</div>

<slot />

<footer class="site-footer">
  <div class="site-footer-inner max-width">
    <div class="footer-links">
      <h2 class="footer-heading">関係機関リンク</h2>
      <ul class="footer-link-list">
        <li>
          <a
            href="https://nostx.shino3.net/npub150qnaaxfan8auqdajvn292cgk2khm3tl8dmakamj878z44a6yntqk7uktv"
            target="_blank"
            rel="noopener noreferrer">流速ちゃん</a
          >
        </li>
        <li>
          <a
            href="https://github.com/ShinoharaTa/nostr-flowmeter-site"
            target="_blank"
            rel="noopener noreferrer">ページソース（GitHub）</a
          >
        </li>
      </ul>
    </div>
    <p class="footer-operator">運営: 野洲田川定点観測所（サイト管理者: shino3）</p>
    <p class="footer-copyright">
      Copyright &copy; 野洲田川定点観測所 All Rights Reserved.
    </p>
  </div>
</footer>

<style>
  :global(body.fs-small) {
    font-size: 11px;
  }

  :global(body.fs-large) {
    font-size: 15px;
  }

  .utility-bar {
    background-color: #f2f2f2;
    border-bottom: 1px solid #ddd;
  }

  .utility-bar-inner {
    margin: 0 auto;
    padding: 2px 16px;
    text-align: right;
    font-size: 11px;
    color: #333;
  }

  .utility-label {
    margin-right: 4px;
  }

  .utility-sep {
    color: #999;
  }

  .utility-btn {
    background: none;
    border: none;
    border-radius: 0;
    padding: 1px 4px;
    font-size: 11px;
    color: #333;
    cursor: pointer;
    text-decoration: underline;
  }

  .utility-btn.active {
    font-weight: bold;
    text-decoration: none;
    background-color: #0b346e;
    color: #fff;
  }

  .utility-print {
    margin-left: 16px;
  }

  @media print {
    .utility-bar {
      display: none;
    }

    .footer-links {
      display: none;
    }
  }

  .site-footer {
    margin-top: 48px;
    background-color: #0b346e;
    color: #fff;
    border-radius: 0;
  }

  .site-footer-inner {
    margin: 0 auto;
    padding: 24px 16px 12px;
  }

  .footer-heading {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 8px;
    padding-left: 8px;
    border-left: 4px solid #fff;
  }

  .footer-link-list {
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
  }

  .footer-link-list li {
    display: inline-block;
    margin-right: 24px;
  }

  .footer-link-list a {
    color: #cfe0f5;
    text-decoration: underline;
  }

  .footer-link-list a:hover {
    color: #fff;
  }

  .footer-operator {
    margin: 0 0 16px;
    font-size: 12px;
  }

  .footer-copyright {
    margin: 0;
    padding: 8px 0;
    border-top: 1px solid #3a5a92;
    font-size: 11px;
    text-align: center;
  }
</style>
