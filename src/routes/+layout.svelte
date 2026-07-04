<script>
import "../styles/style.scss";
import { page } from "$app/stores";
import { getRelay } from "$lib/config";

$: river_name = $page.params.relay
  ? "（" + getRelay($page.params.relay)?.river_name + "）"
  : "";
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

<slot />
