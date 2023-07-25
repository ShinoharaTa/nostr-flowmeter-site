<script lang="ts">
  import { onMount } from "svelte";
  import ClientSelect from "../../components/ClientSelect.svelte";
  import {
    checkNip19,
    checkNip05,
    getLocalStorage,
    updateLocalStorage,
  } from "$lib/app";
  import type { Config, CheckKey } from "$lib/app";
  import { clients } from "$lib/const";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let error = false;
  let process = false;
  const config: Config = getLocalStorage();

  const key: string = $page.params.nip19;
  console.log(key);

  function goBack() {
    window.history.back();
  }

  let result: CheckKey | null = {
    id: "",
    type: "",
  };

  const checkUrl = async () => {
    const nip19 = checkNip19(key);
    if (nip19) {
      return nip19;
    }
    let user: string | null = $page.url.searchParams.get("u");
    user = user ?? key;
    const nip05 = await checkNip05(user);
    if (nip05) {
      return nip05;
    }
    error = true;
    return null;
  }

  onMount(async () => {
    result = await checkUrl();
    if (config.auto) {
      selected();
    }
  });

  const selected = async () => {
    updateLocalStorage(config);
    const client = clients.find((item) => item.key == config.client);
    if (!client) return;
    if (!result) return;
    if (result.type === "user") {
      await goto(client.url_user + result.id);
    }
    if (result.type === "npub") {
      await goto(client.url_user + key);
    }
    if (result.type === "note") {
      await goto(client.url_note + key);
    }
  };
</script>

<div class="page">
  <div class="px-4 pt-3">
    <div class="d-grid">
      <div class="text-center">
        <a href="/">
          <img src="/image/nostxlogo.svg" class="img-fluid w-25" alt="" />
        </a>
      </div>
      {#if !error}
        <div class="mt-3 text-center">クライアントを選択</div>
        <ClientSelect bind:select={config.client} />
        <div class="text-center mt-4">
          <div class="mt-3 text-white">
            <input
              type="checkbox"
              id="select_0"
              name="select_0"
              bind:checked={config.auto}
            />
            <label for="select_0" class="">常にこのアプリを使用する</label>
          </div>
          <div class="mt-4">
            <button
              class="btn btn-lg bg-brand w-75"
              disabled={process}
              on:click={selected}
            >
              {#if !process}
                Nostr で開く
              {:else}
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    class="spinner-border me-3 spinner-border-sm"
                    role="status"
                  />
                  <div>Loading ...</div>
                </div>
              {/if}
            </button>
          </div>
        </div>
      {:else}
        <div
          class="text-danger text-center mt-5 py-4 px-5 border border-danger item"
        >
          <div class="d-flex align-items-center justify-content-center">
            <div class="bg-white error_icon">
              <img src="/image/error_icon.jpg" alt="" class="img-fluid" />
            </div>
          </div>
          <div class="mt-4">
            URLにエラーがあります<br />
            確認が必要です
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="text-center mt-4">
    <a href="javascript:void(0)" on:click={goBack}>前の画面に戻る</a>
  </div>
</div>
