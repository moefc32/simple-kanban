<script>
  import { getModalStore } from "@skeletonlabs/skeleton";
  export let parent;

  const modalStore = getModalStore();
  const formData = {
    title: "",
    due: "",
    detail: "",
  };

  function onFormSubmit() {
    if ($modalStore[0].response) $modalStore[0].response(formData);
    modalStore.close();
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
      <span>Detail</span>
      <textarea class="textarea" rows="6" bind:value={formData.detail} />
    </label>
    <footer class="modal-footer {parent.regionFooter}">
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
        {parent.buttonTextCancel}
      </button>
      <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
        Create
      </button>
    </footer>
  </div>
{/if}
