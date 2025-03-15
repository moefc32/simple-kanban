<script>
    import '../app.css';
    import { ToastProvider } from '@skeletonlabs/skeleton-svelte';

    initializeStores();
</script>

<svelte:head>
    <title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<slot />
<Modal />
<ToastProvider />
