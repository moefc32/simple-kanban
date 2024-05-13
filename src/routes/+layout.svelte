<script>
  import "../app.css";
  import { initializeStores, Modal } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import Header from "./partial/Header.svelte";
  import Footer from "./partial/Footer.svelte";

  initializeStores();
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
  <Modal />
{/if}
