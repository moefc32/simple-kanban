<script>
  import Backlog from "./partial/modal/Backlog.svelte";
  import Settings from "./partial/modal/Settings.svelte";

  const backlogData = {
    to_do: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  let enableReview = true;

  function openModalUpdate() {}
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<main class="flex flex-row flex-1 mb-auto pt-3 w-full">
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
      <div class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3">
        {#each backlogData.to_do as item}
          <div class="p-3 border w-full" on:click={() => openModalUpdate(item)}>
            <strong x-text="item.title"></strong>
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
      <div class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3">
        {#each backlogData.in_progress as item}
          <div class="p-3 border w-full" on:click={() => openModalUpdate(item)}>
            <strong x-text="item.title"></strong>
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
        <div class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3">
          {#each backlogData.in_review as item}
            <div
              class="p-3 border w-full"
              on:click={() => openModalUpdate(item)}
            >
              <strong x-text="item.title"></strong>
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
      <div class="flex flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3">
        {#each backlogData.done as item}
          <div class="p-3 border w-full" on:click={() => openModalUpdate(item)}>
            <strong x-text="item.title"></strong>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<!-- <Backlog />
<Settings /> -->

<style>
  main {
    margin-top: 70px;
  }

  .backlog-category {
    min-width: 200px;
  }
</style>
