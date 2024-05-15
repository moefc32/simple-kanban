<script>
  import { getModalStore } from "@skeletonlabs/skeleton";
  export let parent;

  const modalStore = getModalStore();
  const formData = {
    name: "",
  };

  async function deleteBacklogs() {
    if ($modalStore[0].response) {
      $modalStore[0].response({
        type: "delete",
        formData,
      });
    }

    modalStore.close();
  }

  function onFormSubmit() {
    if ($modalStore[0].response) {
      $modalStore[0].response({
        type: "submit",
        formData,
      });
    }

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
      <input type="text" class="input" bind:value={formData.name} />
    </label>
    <footer class="modal-footer {parent.regionFooter}">
      <button
        class="btn bg-rose-900 text-white me-auto"
        on:click={() => deleteBacklogs()}
      >
        Delete All Backlogs
      </button>
      <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>
        {parent.buttonTextCancel}
      </button>
      <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>
        Save
      </button>
    </footer>
  </div>
{/if}
