<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Plus, Settings, LogOut, Check } from 'lucide-svelte';
    import axios from 'axios';
    import notyf from '$lib/notyf';

    import Avatar from './Avatar.svelte';

    let backlog = {
        title: '',
        detail: '',
        urgency: 'LOW',
        due_time: '',
        status: 'TODO',
    };

    async function handleKeydown(event) {
        if (
            event.key === 'Enter' &&
            backlog.title &&
            backlog.urgency &&
            backlog.due_time &&
            backlog.status
        ) {
            createBacklog();
        }
    }

    async function doLogout() {
        try {
            const { data } = await axios.delete('/api/auth');

            notyf.success('You are now logged out.');
            await goto('/login', { invalidateAll: true });
        } catch (e) {
            console.error(e);
            notyf.error('Logout failed, please try again!');
        }
    }

    async function createBacklog() {
        try {
            const { data } = await axios.post('/api/backlog', backlog);

            notyf.success('New backlog created successfully.');
        } catch (e) {
            console.error(e);
            notyf.error('Cannot create backlog, please try again!');
        }
    }
</script>

<header
    class="navbar flex justify-center bg-sky-800 text-white ps-6 pe-3 h-[60px] fixed top-0 left-0 z-[1000] shadow"
>
    <div class="flex">
        <a
            href="/"
            class="flex items-center ps-10 bg-[url('/favicon.svg')] bg-left bg-no-repeat bg-contain text-xl font-semibold h-[32px] cursor-pointer"
        >
            {import.meta.env.VITE_APP_NAME}
        </a>
    </div>
    <div class="flex gap-1 ms-auto text-[16px]">
        {#if $page.data.userData}
            <ul class="menu menu-horizontal">
                <li>
                    <button
                        class="flex items-center gap-1 font-semibold"
                        on:click={() => create_backlog.showModal()}
                    >
                        <Plus size={14} /> Create Backlog
                    </button>
                </li>
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

<dialog id="create_backlog" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Create New Backlog</h3>
        <div class="flex flex-col gap-4 pt-6">
            <label class="floating-label">
                <span>Title</span>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Backlog title"
                    bind:value={backlog.title}
                    on:keydown={handleKeydown}
                />
            </label>
            <label class="floating-label">
                <span>Detail</span>
                <textarea
                    class="textarea w-full"
                    placeholder="Backlog detail"
                    bind:value={backlog.detail}
                ></textarea>
            </label>
            <label class="floating-label">
                <span>Urgency</span>
                <select class="select appearance-none w-full" bind:value={backlog.urgency}>
                    {#each $page.data.enums?.urgency as item, i}
                        <option value={item.value}>{item.label}</option>
                    {/each}
                </select>
            </label>
            <label class="floating-label">
                <span>Due Time</span>
                <input
                    type="datetime-local"
                    class="input w-full"
                    bind:value={backlog.due_time}
                />
            </label>
            <label class="floating-label">
                <span>Status</span>
                <select class="select appearance-none w-full" bind:value={backlog.status}>
                    {#each $page.data.enums?.status as item, i}
                        <option value={item.value}>{item.label}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="modal-action mt-6">
            <form method="dialog">
                <button class="btn">Cancel</button>
                <button
                    class="btn btn-success"
                    disabled={!backlog.title ||
                        !backlog.urgency ||
                        !backlog.due_time ||
                        !backlog.status}
                    on:click={() => createBacklog()}
                >
                    <Check size={14} /> Save
                </button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
