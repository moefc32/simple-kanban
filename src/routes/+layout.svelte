<script>
  import "../app.css";
  import { page } from "$app/stores";
  import Header from "./partial/Header.svelte";
  import Footer from "./partial/Footer.svelte";
</script>

<svelte:head>
  <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

{#if $page.status >= 300}
  <slot />
{:else}
  <Header />
  <slot />
  <Footer />
{/if}
