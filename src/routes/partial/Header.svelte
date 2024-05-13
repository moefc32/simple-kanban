<script>
  function openModalCreate() {}
  function openModalSettings() {}
</script>

<header class="bg-white border-b-2 w-full">
  <nav class="flex items-center justify-between px-6 py-5">
    <div class="flex flex-1">
      <a href="/" class="text-xl">Kanban Board</a>
    </div>
    <div class="flex flex-1 gap-x-6 justify-end">
      <button
        class="flex gap-1 font-semibold leading-6 text-gray-800"
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
        Add Backlog
      </button>
      <button
        class="flex gap-1 font-semibold leading-6 text-gray-800"
        on:@click={() => openModalSettings()}
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
            d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"
          />
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
        </svg>
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
