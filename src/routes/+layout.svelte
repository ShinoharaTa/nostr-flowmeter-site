<script>
  import "../styles/style.scss";
  import { page } from '$app/stores';
  import { getRelay } from "$lib/config";
  $: river_name = $page.params.relay ? '（' + getRelay($page.params.relay)?.river_name + '）' : ''
</script>

<svelte:head>
  <title>野洲田川定点観測所{river_name}</title>
  <meta name="description" content="Nostr{river_name}リレーの流速を表示します">
</svelte:head>

<slot />
