<script>
    import { getContext } from 'svelte';
    import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
    import { Plus } from 'lucide-svelte';
    import axios from 'axios';

    import Backlog from './BacklogModal.svelte';

    const loadData = getContext('loadData');
    const modalStore = getModalStore();
    const toastStore = getToastStore();

    function openModalCreate() {
        modalStore.trigger({
            title: 'Create New Backlog',
            type: 'component',
            component: {
                ref: Backlog,
            },
            response: async r => {
                if (r?.type === 'submit') {
                    await axios.post('api/backlog', r.formData);
                    await loadData();

                    toastStore.trigger({
                        message: 'New backlog created successfully.',
                        background: 'variant-filled-success',
                    });
                }
            },
        });
    }
</script>

<header
    class="flex items-center justify-between px-6 bg-slate-700 text-white border-b-2 w-full h-[65px] fixed top-0 left-0"
>
    <a href="/" class="text-xl font-semibold">Kanban Board</a>
    <button
        class="flex items-center gap-1 font-semibold"
        on:click={() => openModalCreate()}
    >
        <Plus size={18} /> Create Backlog
    </button>
</header>
