<script>
  import { getModalStore } from "@skeletonlabs/skeleton";
  export let parent;

  const modalStore = getModalStore();
  const formData = {
    name: "",
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
      <span>Name</span>
      <input
        type="text"
        class="input"
        placeholder="Enter name..."
        bind:value={formData.name}
      />
    </label>
    <footer class="modal-footer {parent.regionFooter}">
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
        {parent.buttonTextCancel}
      </button>
      <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
        Save
      </button>
    </footer>
  </div>
{/if}
