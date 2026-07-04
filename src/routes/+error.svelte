<script lang="ts">
import { page } from "$app/stores";
</script>

<div class="text-center bg-main p-2">
  <span class="fs-5"><a href="/" class="text-light">野洲田川定点観測所</a></span
  >
</div>

<div class="max-width mx-auto container">
  <div class="row text-center mt-5">
    <div class="fs-1">{$page.status}</div>
    <div class="fs-3">{$page.status === 404 ? "Not Found" : "Error"}</div>
    <div class="mt-4">
      {$page.error?.message ?? "エラーが発生しました"}
    </div>
  </div>
</div>

<style>
  a {
    text-decoration: none;
  }
</style>
