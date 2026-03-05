<script>
    export let hashed_email;
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<div class="avatar">
    <div class="bg-gray-500 w-10 rounded-full">
        <img src="https://gravatar.com/avatar/{hashed_email}?s=40" />
    </div>
</div>
