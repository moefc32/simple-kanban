<script>
    import { setContext } from 'svelte';
    import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
    import { flip } from 'svelte/animate';
    import { List, Repeat, Search, Check } from 'lucide-svelte';
    import axios from 'axios';
    import datePrettier from '$lib/datePrettier';

    import Header from '$lib/component/Header.svelte';
    import Footer from '$lib/component/Footer.svelte';
    import Backlog from '$lib/component/BacklogModal.svelte';

    const modalStore = getModalStore();
    const toastStore = getToastStore();

    export let data;

    const today = new Date().getTime();

    let { backlogData } = data;

    function openModalUpdate(item) {
        modalStore.trigger({
            title: 'Backlog Details',
            type: 'component',
            component: {
                ref: Backlog,
            },
            meta: {
                ...item,
            },
            response: async r => {
                if (r?.type === 'submit') {
                    await axios.patch(
                        `api/backlog/?id=${r.formData._id}`,
                        r.formData,
                    );
                    await loadData();
                }

                if (r?.type === 'delete') {
                    modalStore.trigger({
                        title: 'Delete Backlog',
                        type: 'confirm',
                        body: `Are you sure you want to delete this backlog?`,
                        response: async rsp => {
                            if (rsp) {
                                await axios.delete(
                                    `api/backlog/?id=${r.formData._id}`,
                                );
                                await loadData();

                                toastStore.trigger({
                                    message: 'Backlog deleted successfully.',
                                    background: 'variant-filled-error',
                                });
                            }
                        },
                    });
                }
            },
        });
    }

    async function dragStart(event, backlogStatus, itemIndex) {
        const data = { backlogStatus, itemIndex };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    async function drop(event, backlogStatus) {
        event.preventDefault();

        const json = event.dataTransfer.getData('text/plain');
        const data = JSON.parse(json);
        const [item] = backlogData[data.backlogStatus].splice(
            data.itemIndex,
            1,
        );

        backlogData[backlogStatus].push(item);
        backlogData = { ...backlogData };

        await axios.patch(`api/backlog/?id=${item._id}`, {
            progress: backlogStatus,
        });
    }

    async function loadData() {
        const result = await axios.get('api/backlog');
        backlogData = result.data.data;
    }

    setContext('loadData', loadData);
</script>

<Header />
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<main class="flex flex-row flex-1 mt-[70px] mb-auto pt-3 bg-slate-50 w-full">
    <div class="flex flex-1 px-3 overflow-x-auto">
        {#each Object.entries(backlogData) as [status, backlogs]}
            <div class="flex flex-1 flex-col gap-2 px-2 min-w-[275px] border-r">
                <div class="flex items-center gap-1 px-1 py-3 border-b">
                    {#if status === 'to_do'}
                        <List size={16} /> To-Do
                    {:else if status === 'in_progress'}
                        <Repeat size={16} /> In Progress
                    {:else if status === 'in_review'}
                        <Search size={16} /> In Review
                    {:else}
                        <Check size={16} /> Done
                    {/if}
                </div>
                <div
                    class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3 max-h-[calc(100dvh-190px)]"
                    on:dragover={event => event.preventDefault()}
                    on:drop={event => drop(event, status)}
                >
                    {#each backlogs as item, itemIndex (item)}
                        <div
                            class="px-4 py-3 border rounded-lg bg-white w-full shadow-sm cursor-grab"
                            title={item.title}
                            on:click={() => openModalUpdate(item)}
                            draggable={true}
                            on:dragstart={event =>
                                dragStart(event, status, itemIndex)}
                            animate:flip={{ duration: 250 }}
                        >
                            <div class="mb-1 text-lg line-clamp-2">
                                {item.title}
                            </div>
                            <div class="flex items-end">
                                {#if item.urgency === 'low'}
                                    <span
                                        class="badge variant-filled-surface text-xs"
                                        >Low</span
                                    >
                                {:else if item.urgency === 'medium'}
                                    <span
                                        class="badge variant-filled-warning text-xs"
                                        >Medium</span
                                    >
                                {:else}
                                    <span
                                        class="badge variant-filled-error text-xs"
                                        >Urgent</span
                                    >
                                {/if}
                                <span
                                    class={`ms-auto text-xs ${
                                        status !== 'done' && item.due < today
                                            ? 'text-red-500'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {'Due ' + datePrettier(item.due, false)}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</main>
<Footer />
