<script>
  import { getModalStore } from "@skeletonlabs/skeleton";

  export let parent;

  const modalStore = getModalStore();

  const today = new Date();
  today.setHours(13, 0, 0, 0);
  const dueToday = parseInt(today.toISOString().slice(0, 16));

  let formData = {
    _id: "",
    title: "",
    detail: "",
    urgency: "low",
    due: getFormattedDate(),
    progress: "to_do",
  };

  function getFormattedDate(datetime) {
    const date = datetime ? new Date(parseInt(datetime)) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async function deleteBacklog() {
    if ($modalStore[0].response) {
      $modalStore[0].response({
        type: "delete",
        formData,
      });
    }

    modalStore.close();
  }

  async function onFormSubmit() {
    if ($modalStore[0].response) {
      $modalStore[0].response({
        type: "submit",
        formData,
      });
    }

    modalStore.close();
  }

  $: {
    if ($modalStore[0]?.meta && $modalStore[0]?.meta?._id !== formData._id) {
      formData = {
        _id: $modalStore[0].meta._id,
        title: $modalStore[0].meta.title,
        detail: $modalStore[0].meta.detail,
        urgency: $modalStore[0].meta.urgency,
        due: getFormattedDate($modalStore[0].meta.due),
        progress: $modalStore[0].meta.progress,
      };
    }
  }
</script>

{#if $modalStore[0]}
  <div class="card p-4 w-modal shadow-xl space-y-4">
    <header class="my-2 text-2xl font-bold">
      {$modalStore[0].title}
    </header>
    <label class="label">
      <span>Title</span>
      <input type="text" class="input" bind:value={formData.title} />
    </label>
    <label class="label">
      <span>Due Date</span>
      <input
        class="input"
        title="Input (datetime-local)"
        type="datetime-local"
        bind:value={formData.due}
      />
    </label>
    <label class="label">
      <span>Status</span>
      <select class="select" bind:value={formData.progress}>
        <option value="to_do">To-Do</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="done">Done</option>
      </select>
    </label>
    <label class="label">
      <span>Urgency</span>
      <select class="select" bind:value={formData.urgency}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="urgent">Urgent</option>
      </select>
    </label>
    <label class="label">
      <span>Detail</span>
      <textarea
        class="textarea resize-none"
        rows="6"
        bind:value={formData.detail}
      />
    </label>
    <footer class="modal-footer {parent.regionFooter}">
      {#if $modalStore[0]?.meta?._id}
        <button
          class="btn bg-rose-900 text-white me-auto"
          on:click={() => deleteBacklog(formData._id)}
        >
          Delete
        </button>
      {/if}
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
        {parent.buttonTextCancel}
      </button>
      <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
        {formData._id ? "Update" : "Create"}
      </button>
    </footer>
  </div>
{/if}
