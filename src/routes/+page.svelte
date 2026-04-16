<script>
    import { Plus, List, Repeat, Search, Check } from 'lucide-svelte';
    import ky from 'ky';
    import { toast } from 'svelte-sonner';
    import datePrettier from '$lib/datePrettier';

    export let data;

    let { contents, enums } = data;

    const today = new Date().getTime();
    const urgencyStyles = {
        URGENT: 'badge-error text-white',
        MEDIUM: 'badge-warning',
        LOW: 'bg-gray-300',
    };
    const statusMap = Object.fromEntries(
        enums.status.map(s => [s.value, s.label]),
    );
    const iconMap = {
        TODO: List,
        PROGRESS: Repeat,
        REVIEW: Search,
        DONE: Check,
    };

    let backlog = {
        _id: '',
        title: '',
        detail: '',
        urgency: 'LOW',
        dueTime: '',
        status: 'TODO',
    };

    async function openModalCreate(status) {
        backlog = {
            _id: '',
            title: '',
            detail: '',
            urgency: 'LOW',
            dueTime: '',
            status: status,
        };

        backlog_modal.showModal();
    }

    async function createBacklog() {
        try {
            const response = await ky
                .post('/api/backlog', {
                    json: backlog,
                })
                .json();

            contents[response.data.status].push(response.data);

            toast.success('New backlog created successfully.');
            contents = { ...contents };
        } catch (e) {
            console.error(e);
            toast.error('Cannot create backlog, please try again!');
        }
    }

    async function openModalUpdate(id) {
        try {
            const result = await ky
                .get(`api/backlog`, {
                    searchParams: { id },
                })
                .json();
            const { data } = result;

            data.dueTime = new Date(data.dueTime).toISOString().slice(0, 16);
            backlog = data;

            backlog_modal.showModal();
        } catch (e) {
            console.error(e);
            toast.error('Cannot open backlog, please try again!');
        }
    }

    async function updateBacklog() {
        try {
            const result = await ky
                .patch('api/backlog', {
                    searchParams: { id: backlog._id },
                    json: backlog,
                })
                .json();
            const { data } = result;

            data.dueTime = new Date(data.dueTime).getTime();
            let oldStatus = '';

            for (const [status, list] of Object.entries(contents)) {
                if (list.some(item => item._id === data._id)) {
                    oldStatus = status;
                    break;
                }
            }

            contents[oldStatus] = contents[oldStatus].filter(
                i => i._id !== data._id,
            );

            contents[data.status].push(data);

            contents[data.status].sort((a, b) => {
                return (
                    enums.urgency.findIndex(u => u.value === a.urgency) -
                    enums.urgency.findIndex(u => u.value === b.urgency)
                );
            });

            toast.success('Backlog updated successfully.');
            contents = { ...contents };
        } catch (e) {
            console.error(e);
            toast.error('Update backlog failed, please try again!');
        }
    }

    async function deleteBacklog() {
        try {
            const result = await ky
                .delete('api/backlog', {
                    searchParams: { id: backlog._id },
                })
                .json();

            contents[backlog.status] = contents[backlog.status].filter(
                item => item._id !== backlog._id,
            );

            toast.success('Backlog deleted successfully.');
            contents = { ...contents };
        } catch (e) {
            console.error(e);
            toast.error('Delete backlog failed, please try again!');
        }
    }

    async function dragStart(event, backlogStatus, itemIndex) {
        const data = { backlogStatus, itemIndex };
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    async function drop(event, backlogStatus) {
        event.preventDefault();

        const json = event.dataTransfer.getData('text/plain');
        const data = JSON.parse(json);
        const [item] = contents[data.backlogStatus].splice(data.itemIndex, 1);

        contents[backlogStatus].push(item);
        contents = { ...contents };

        await ky
            .patch('api/backlog', {
                searchParams: { id: item._id },
                json: { status: backlogStatus },
            })
            .json();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<main class="flex flex-1 flex-col justify-start gap-6 pt-6 w-full">
    <div class="flex flex-1 px-3 overflow-x-auto pb-3">
        {#each Object.entries(contents) as [status, backlogs], i}
            <div
                class="flex flex-1 flex-col gap-2 px-2 min-w-80 {i <
                    Object.keys(contents).length - 1 &&
                    'border-e border-gray-300'}"
            >
                <div class="flex items-center gap-1 px-1 pb-3 border-b">
                    <svelte:component
                        this={iconMap[status] || List}
                        size={16}
                    />
                    <span>{statusMap[status] || 'Unknown'}</span>
                    <button
                        class="btn btn-success btn-xs ms-auto"
                        on:click={() => openModalCreate(status)}
                    >
                        <Plus size={14} /> Create
                    </button>
                </div>
                <div
                    class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 py-2 max-h-[calc(100dvh-145px)]"
                    on:dragover={event => event.preventDefault()}
                    on:drop={event => drop(event, status)}
                >
                    {#each backlogs as item, itemIndex (item)}
                        <div
                            class="px-4 py-3 border-1 border-gray-300 rounded-lg bg-white w-full shadow-lg cursor-grab"
                            title={item.title}
                            on:click={() => openModalUpdate(item._id)}
                            draggable={true}
                            on:dragstart={event =>
                                dragStart(event, status, itemIndex)}
                        >
                            <div class="mb-3 line-clamp-2">
                                {item.title}
                            </div>
                            <div class="flex items-end">
                                <span
                                    class="badge badge-xs {urgencyStyles[
                                        item.urgency
                                    ]}"
                                >
                                    {enums.urgency.find(
                                        u => u.value === item.urgency,
                                    )?.label}
                                </span>
                                <span
                                    class={`ms-auto text-xs ${
                                        status !== 'DONE' &&
                                        item.dueTime < today
                                            ? 'text-red-500'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {'Due ' +
                                        datePrettier(item.dueTime, {
                                            date: 'short',
                                        })}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</main>

<dialog id="backlog_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">
            {backlog._id ? 'Edit Backlog' : 'Create New Backlog'}
        </h3>
        <div class="flex flex-col gap-4 pt-6">
            <label class="floating-label">
                <span>Title</span>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Backlog title"
                    bind:value={backlog.title}
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
                <select
                    class="select appearance-none w-full"
                    bind:value={backlog.urgency}
                >
                    {#each enums.urgency as item, i}
                        <option value={item.value}>{item.label}</option>
                    {/each}
                </select>
            </label>
            <label class="floating-label">
                <span>Due Time</span>
                <input
                    type="datetime-local"
                    class="input w-full"
                    bind:value={backlog.dueTime}
                />
            </label>
            <label class="floating-label">
                <span>Status</span>
                <select
                    class="select appearance-none w-full"
                    bind:value={backlog.status}
                >
                    {#each enums.status as item, i}
                        <option value={item.value}>{item.label}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="modal-action mt-6">
            {#if backlog._id}
                <form method="dialog" class="flex gap-1 w-full">
                    <button
                        class="btn btn-outline btn-error me-auto"
                        on:click={() => env_delete.showModal()}
                    >
                        Delete
                    </button>
                    <button class="btn">Cancel</button>
                    <button
                        class="btn btn-success"
                        disabled={!backlog.title ||
                            !backlog.urgency ||
                            !backlog.dueTime ||
                            !backlog.status}
                        on:click={() => updateBacklog()}
                    >
                        <Check size={14} /> Update
                    </button>
                </form>
            {:else}
                <form method="dialog">
                    <button class="btn">Cancel</button>
                    <button
                        class="btn btn-success"
                        disabled={!backlog.title ||
                            !backlog.urgency ||
                            !backlog.dueTime ||
                            !backlog.status}
                        on:click={() => createBacklog()}
                    >
                        <Check size={14} /> Save
                    </button>
                </form>
            {/if}
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

<dialog id="env_delete" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Delete Backlog</h3>
        <p class="py-4">Are you sure you want to delete this backlog?</p>
        <div class="modal-action mt-3">
            <form method="dialog">
                <button class="btn">Cancel</button>
                <button class="btn btn-error" on:click={() => deleteBacklog()}>
                    Delete
                </button>
            </form>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
