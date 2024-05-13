<div class="modal fade" id="backlog" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header text-bg-dark">
        <h5
          class="modal-title"
          x-text="isModalUpdate ? 'Create Backlog' : 'Update Backlog'"
        ></h5>
        <button type="button" class="btn-close bg-light" data-bs-dismiss="modal"
        ></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
          x-text="isModalUpdate ? 'Cancel' : 'Close'"
        ></button>
        <button type="button" class="btn btn-primary">
          <i class="fa-solid fa-check fa-fw me-1"></i> Save changes
        </button>
      </div>
    </div>
  </div>
</div>
