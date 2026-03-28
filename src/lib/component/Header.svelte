<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Plus, Settings, LogOut, Check } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import ky from 'ky';

    import Avatar from './Avatar.svelte';

    async function doLogout() {
        try {
            await ky.delete('/api/auth');

            toast.success('You are now logged out.');
            await goto('/login', { invalidateAll: true });
        } catch (e) {
            console.error(e);
            toast.error('Logout failed, please try again!');
        }
    }
</script>

<header
    class="navbar flex justify-center bg-sky-800 text-white ps-6 pe-3 h-15 fixed top-0 left-0 z-1200 shadow"
>
    <div class="flex">
        <a
            href="/"
            class="flex items-center ps-10 bg-[url('/favicon.svg')] bg-left bg-no-repeat bg-contain text-xl font-semibold h-8 cursor-pointer"
        >
            {import.meta.env.VITE_APP_NAME}
        </a>
    </div>
    <div class="flex gap-1 ms-auto">
        {#if $page.data.userData}
            <ul class="menu menu-horizontal">
                <li>
                    <a href="/settings">
                        <Settings size={14} /> Edit Account
                    </a>
                </li>
                <li>
                    <button on:click={() => doLogout()}>
                        <LogOut size={14} /> Logout
                    </button>
                </li>
            </ul>
        {/if}
    </div>
</header>
