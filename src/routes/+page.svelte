<script lang="ts">
  import { relays } from "$lib/config";
</script>

<!-- {#if items} -->
<div class="bg-main text-center py-5">
  <div class="fs-1">野州田川水系</div>
  <div class="fs-3 mt-2">定点観測所</div>
</div>
<div class="row max-width mx-auto pt-4 align-items-center">
  {#each relays as relay}
    <div class="col-md-6 fs-4 text-md-end text-center py-2">
      <a href="/{relay.key}" class="text-primary">{relay.river_name}</a>
    </div>
    <div class="col-md-6 fs-6 text-md-start text-center py-2">{relay.relay_url}</div>
  {/each}
</div>
<!-- {/if} -->
