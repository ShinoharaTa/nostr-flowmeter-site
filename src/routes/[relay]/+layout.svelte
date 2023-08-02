<script>
  import SubHeader from "../../components/subheader.svelte";
</script>

<div class="text-center bg-main p-2">
  <span class="fs-5"><a href="/" class="text-light">野洲田川定点観測所</a></span
  >
</div>
<SubHeader />
<div class="p-2" />
<slot />

<style>
  a {
    text-decoration: none;
  }
</style>
