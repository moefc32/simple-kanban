<script>
  import { getContext } from "svelte";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import axios from "axios";

  import Backlog from "./BacklogModal.svelte";

  const loadData = getContext("loadData");
  const modalStore = getModalStore();
  const toastStore = getToastStore();

  function openModalCreate() {
    modalStore.trigger({
      title: "Create New Backlog",
      type: "component",
      component: {
        ref: Backlog,
      },
      response: async (r) => {
        if (r?.type === "submit") {
          await axios.post("api/backlog", r.formData);
          await loadData();

          toastStore.trigger({
            message: "New backlog created successfully.",
            background: "variant-filled-success",
          });
        }
      },
    });
  }
</script>

<header class="bg-slate-700 text-white border-b-2 w-full">
  <nav class="flex items-center justify-between px-6 py-5">
    <div class="flex">
      <a href="/" class="font-semibold text-xl">Kanban Board</a>
    </div>
    <div class="flex flex-1 gap-x-4 sm:gap-x-6 ms-3 justify-end">
      <button
        class="flex gap-1 font-semibold leading-6"
        on:click={() => openModalCreate()}
      >
        <svg
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h14m-7 7V5"
          />
        </svg>
        <span class="hidden sm:inline">Create Backlog</span>
      </button>
    </div>
  </nav>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
