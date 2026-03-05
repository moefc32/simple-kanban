<script>
    import { List, Repeat, Search, Check } from 'lucide-svelte';
    import axios from 'axios';
    import datePrettier from '$lib/datePrettier';
    import notyf from '$lib/notyf';

    export let data;

    let { contents, enums } = data;

    const today = new Date().getTime();
    const urgencyStyles = {
        URGENT: 'badge-error text-white',
        MEDIUM: 'badge-warning',
        LOW: 'badge-primary',
    };

    let backlog = {
        id: '',
        title: '',
        detail: '',
        urgency: 'LOW',
        due_time: '',
        status: 'TODO',
    };

    async function openModalUpdate(id) {
        try {
            const result = await axios.get(`api/backlog?id=${id}`);
            const { data } = result.data;

            data.due_time = new Date(data.due_time).toISOString().slice(0, 16);
            backlog = data;

            edit_backlog.showModal();
        } catch (e) {
            console.error(e);
            notyf.error('Cannot open backlog, please try again!');
        }
    }

    async function updateBacklog() {
        try {
            const result = await axios.patch(
                `api/backlog?id=${backlog._id}`,
                backlog,
            );
            const { data } = result.data;
            data.due_time = new Date(data.due_time).getTime();

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

            notyf.success('Backlog updated successfully.');
            contents = { ...contents };
        } catch (e) {
            console.error(e);
            notyf.error('Update backlog failed, please try again!');
        }
    }

    async function deleteBacklog() {
        try {
            const result = await axios.delete(`api/backlog?id=${backlog._id}`);

            contents[backlog.status] = contents[backlog.status].filter(
                item => item._id !== backlog._id,
            );

            notyf.success('Backlog deleted successfully.');
            contents = { ...contents };
        } catch (e) {
            console.error(e);
            notyf.error('Delete backlog failed, please try again!');
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

        await axios.patch(`api/backlog/?id=${item._id}`, {
            status: backlogStatus,
        });
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<main class="flex flex-1 flex-col justify-start gap-6 pt-6 w-full">
    <div class="flex flex-1 px-3 overflow-x-auto">
        {#each Object.entries(contents) as [status, backlogs], i}
            <div
                class="flex flex-1 flex-col gap-2 px-2 mb-2 min-w-[275px] {i <
                    Object.keys(contents).length - 1 &&
                    'border-e border-gray-300'}"
            >
                <div class="flex items-center gap-1 px-1 pb-3 border-b">
                    {#if status === 'TODO'}
                        <List size={16} /> To-Do
                    {:else if status === 'PROGRESS'}
                        <Repeat size={16} /> In Progress
                    {:else if status === 'REVIEW'}
                        <Search size={16} /> In Review
                    {:else}
                        <Check size={16} /> Done
                    {/if}
                </div>
                <div
                    class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 py-3 max-h-[calc(100dvh-190px)]"
                    on:dragover={event => event.preventDefault()}
                    on:drop={event => drop(event, status)}
                >
                    {#each backlogs as item, itemIndex (item)}
                        <div
                            class="px-4 py-3 border rounded-lg bg-white w-full shadow-sm cursor-grab"
                            title={item.title}
                            on:click={() => openModalUpdate(item._id)}
                            draggable={true}
                            on:dragstart={event =>
                                dragStart(event, status, itemIndex)}
                            animate:flip={{ duration: 250 }}
                        >
                            <div class="mb-3 text-lg line-clamp-2">
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
                                        item.due_time < today
                                            ? 'text-red-500'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {'Due ' +
                                        datePrettier(item.due_time, {
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

<dialog id="edit_backlog" class="modal modal-bottom sm:modal-middle">
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
                    bind:value={backlog.due_time}
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
            <form method="dialog" class="flex gap-1 w-full">
                <button
                    class="btn btn-error me-auto"
                    on:click={() => env_delete.showModal()}
                >
                    Delete
                </button>
                <button class="btn">Cancel</button>
                <button
                    class="btn btn-success"
                    disabled={!backlog.title ||
                        !backlog.urgency ||
                        !backlog.due_time ||
                        !backlog.status}
                    on:click={() => updateBacklog()}
                >
                    <Check size={14} /> Update
                </button>
            </form>
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
