<script>
  import { setContext } from "svelte";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import { flip } from "svelte/animate";
  import axios from "axios";
  import datePrettier from "$lib/datePrettier";

  import Header from "./partial/Header.svelte";
  import Footer from "./partial/Footer.svelte";
  import Backlog from "./partial/modal/Backlog.svelte";

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  export let data;

  let { backlogData } = data;
  let enableReview = true;

  function openModalUpdate(item) {
    modalStore.trigger({
      title: "Backlog Details",
      type: "component",
      component: {
        ref: Backlog,
      },
      meta: {
        ...item,
      },
      response: async (r) => {
        if (r?.type === "submit") {
          await axios.patch(`api/backlog/?id=${r.formData._id}`, r.formData);
          await loadData();
        }

        if (r?.type === "delete") {
          modalStore.trigger({
            title: "Delete Backlog",
            type: "confirm",
            body: `Are you sure you want to delete this backlog?`,
            response: async (rsp) => {
              if (rsp) {
                await axios.delete(`api/backlog/?id=${r.formData._id}`);
                await loadData();

                toastStore.trigger({
                  message: "Backlog deleted successfully.",
                  background: "variant-filled-error",
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
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  async function drop(event, backlogStatus) {
    event.preventDefault();

    const json = event.dataTransfer.getData("text/plain");
    const data = JSON.parse(json);
    const [item] = backlogData[data.backlogStatus].splice(data.itemIndex, 1);

    backlogData[backlogStatus].push(item);
    backlogData = { ...backlogData };

    await axios.patch(`api/backlog/?id=${item._id}`, {
      progress: backlogStatus,
    });
  }

  async function loadData() {
    const result = await axios.get("api/backlog");
    backlogData = result.data.data;
  }

  setContext("loadData", loadData);
</script>

<Header />
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<main class="flex flex-row flex-1 mb-auto pt-3 bg-slate-50 w-full">
  <div class="flex flex-1 px-3 overflow-x-auto">
    <div class="backlog-category flex flex-1 flex-col gap-2 px-2 border-r">
      <div class="flex gap-1 leading-5 px-1 py-3 border-b">
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
          />
        </svg>
        To-Do
      </div>
      <div
        class="backlog-container flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3"
        on:dragover={(event) => event.preventDefault()}
        on:drop={(event) => drop(event, "to_do")}
      >
        {#each backlogData.to_do as item, itemIndex (item)}
          <div
            class="backlog-item px-4 py-3 border rounded-lg bg-white w-full shadow-sm"
            title={item.title}
            on:click={() => openModalUpdate(item)}
            draggable={true}
            on:dragstart={(event) => dragStart(event, "to_do", itemIndex)}
            animate:flip={{ duration: 250 }}
          >
            <div class="mb-1 text-lg line-clamp-2">{item.title}</div>
            <div class="mb-2 text-xs text-gray-700">
              {"Due " + datePrettier(item.due, false)}
            </div>
            {#if item.urgency === "low"}
              <span class="badge variant-filled-surface text-xs">Low</span>
            {:else if item.urgency === "medium"}
              <span class="badge variant-filled-warning text-xs">Medium</span>
            {:else}
              <span class="badge variant-filled-error text-xs">Urgent</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    <div class="backlog-category flex flex-1 flex-col gap-2 px-2 border-r">
      <div class="flex gap-1 leading-5 px-1 py-3 border-b">
        <svg
          class="w-5 h-5"
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
            d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
          />
        </svg>
        In Progress
      </div>
      <div
        class="backlog-container flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3"
        on:dragover={(event) => event.preventDefault()}
        on:drop={(event) => drop(event, "in_progress")}
      >
        {#each backlogData.in_progress as item, itemIndex (item)}
          <div
            class="backlog-item px-4 py-3 border rounded-lg bg-white w-full shadow-sm"
            title={item.title}
            on:click={() => openModalUpdate(item)}
            draggable={true}
            on:dragstart={(event) => dragStart(event, "in_progress", itemIndex)}
            animate:flip={{ duration: 250 }}
          >
            <div class="mb-1 text-lg line-clamp-2">{item.title}</div>
            <div class="mb-2 text-xs text-gray-700">
              {"Due " + datePrettier(item.due, false)}
            </div>
            {#if item.urgency === "low"}
              <span class="badge variant-filled-surface text-xs">Low</span>
            {:else if item.urgency === "medium"}
              <span class="badge variant-filled-warning text-xs">Medium</span>
            {:else}
              <span class="badge variant-filled-error text-xs">Urgent</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    {#if enableReview}
      <div class="backlog-category flex flex-1 flex-col gap-2 px-2 border-r">
        <div class="flex gap-1 leading-5 px-1 py-3 border-b">
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          In Review
        </div>
        <div
          class="backlog-container flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3"
          on:dragover={(event) => event.preventDefault()}
          on:drop={(event) => drop(event, "in_review")}
        >
          {#each backlogData.in_review as item, itemIndex (item)}
            <div
              class="backlog-item px-4 py-3 border rounded-lg bg-white w-full shadow-sm"
              title={item.title}
              on:click={() => openModalUpdate(item)}
              draggable={true}
              on:dragstart={(event) => dragStart(event, "in_review", itemIndex)}
              animate:flip={{ duration: 250 }}
            >
              <div class="mb-1 text-lg line-clamp-2">{item.title}</div>
              <div class="mb-2 text-xs text-gray-700">
                {"Due " + datePrettier(item.due, false)}
              </div>
              {#if item.urgency === "low"}
                <span class="badge variant-filled-surface text-xs">Low</span>
              {:else if item.urgency === "medium"}
                <span class="badge variant-filled-warning text-xs">Medium</span>
              {:else}
                <span class="badge variant-filled-error text-xs">Urgent</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    <div class="backlog-category flex flex-1 flex-col gap-2 px-2">
      <div class="flex gap-1 leading-5 px-1 py-3 border-b">
        <svg
          class="w-5 h-5"
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
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
        Done
      </div>
      <div
        class="backlog-container flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3"
        on:dragover={(event) => event.preventDefault()}
        on:drop={(event) => drop(event, "done")}
      >
        {#each backlogData.done as item, itemIndex (item)}
          <div
            class="backlog-item px-4 py-3 border rounded-lg bg-white w-full shadow-sm"
            title={item.title}
            on:click={() => openModalUpdate(item)}
            draggable={true}
            on:dragstart={(event) => dragStart(event, "done", itemIndex)}
            animate:flip={{ duration: 250 }}
          >
            <div class="mb-1 text-lg line-clamp-2">{item.title}</div>
            <div class="mb-2 text-xs text-gray-700">
              {"Due " + datePrettier(item.due, false)}
            </div>
            {#if item.urgency === "low"}
              <span class="badge variant-filled-surface text-xs">Low</span>
            {:else if item.urgency === "medium"}
              <span class="badge variant-filled-warning text-xs">Medium</span>
            {:else}
              <span class="badge variant-filled-error text-xs">Urgent</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
<Footer />

<style>
  main {
    margin-top: 70px;
  }

  .backlog-category {
    min-width: 200px;
  }

  .backlog-container {
    max-height: calc(100vh - 190px);
  }

  .backlog-item {
    cursor: grab;
  }
</style>
