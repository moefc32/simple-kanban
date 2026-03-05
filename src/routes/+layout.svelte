<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import 'notyf/notyf.min.css';
    import { page } from '$app/stores';

    import Header from '$lib/component/Header.svelte';

    export let data;

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

    $: isValidStatusCode = $page.status >= 200 && $page.status < 300;
</script>

<svelte:head>
    <title>
        {$page.data.pageTitle && $page.data.pageTitle + ' | '}
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

{#if !isValidStatusCode}
    <slot />
{:else}
    <div class="flex flex-1 flex-col pt-[60px] w-full">
        <Header />
        <slot />
    </div>
{/if}
