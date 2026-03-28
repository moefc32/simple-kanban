<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { Toaster } from 'svelte-sonner';

    import Header from '$lib/component/Header.svelte';

    let { children, data } = $props();

    onMount(() => {
        function handleBfcache(event) {
            if (!event.persisted) return;

            const hasSession = document.cookie.includes('__session_active=1');
            const path = window.location.pathname;

            const isAuth = data.unauthRoutes.some(r => path.startsWith(r));
            const isPublic = data.publicRoutes.some(r => path.startsWith(r));
            const isProtected = !isAuth && !isPublic;

            if ((isProtected && !hasSession) || (isAuth && hasSession)) {
                window.location.reload();
            }
        }

        window.addEventListener('pageshow', handleBfcache);

        return function () {
            window.removeEventListener('pageshow', handleBfcache);
        };
    });
</script>

<svelte:head>
    <title>
        {$page.data.pageTitle && $page.data.pageTitle + ' | '}
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

<div class="flex flex-1 flex-col pt-15 w-full">
    <Header />
    {@render children()}
</div>

<Toaster
    richColors
    theme="system"
    position="bottom-right"
    toastOptions={{
        style: 'font-size: 1rem;',
    }}
/>
