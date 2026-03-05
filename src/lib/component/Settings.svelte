<script>
    import { Eye, EyeOff, Check } from 'lucide-svelte';
    import isValidEmail from '$lib/isValidEmail';

    import Avatar from './Avatar.svelte';

    export let settings;
    export let saveSettings;

    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && settings.email && settings.password) {
            saveSettings();
        }
    }
</script>

<div
    class="card flex flex-col gap-2 my-auto p-6 bg-white w-full max-w-[450px] shadow-xl -top-6"
>
    <h1 class="my-2 text-3xl text-center">Edit Account</h1>
    <input
        type="text"
        class="input input-bordered w-full"
        placeholder="New user name"
        bind:value={settings.name}
        on:keydown={handleKeydown}
    />
    <input
        type="email"
        class="input input-bordered w-full"
        placeholder="New email"
        bind:value={settings.email}
        on:keydown={handleKeydown}
    />
    <label class="input input-bordered flex items-center gap-2 w-full">
        {#if !showPassword}
            <input
                type="password"
                class="grow"
                placeholder="New password"
                bind:value={settings.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to show password"
                on:click={() => (showPassword = !showPassword)}
            >
                <Eye size={18} />
            </button>
        {:else}
            <input
                type="text"
                class="grow"
                placeholder="New password"
                bind:value={settings.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to hide password"
                on:click={() => (showPassword = !showPassword)}
            >
                <EyeOff size={18} />
            </button>
        {/if}
    </label>
    <button
        class="btn btn-primary self-start mt-2"
        title="Save account data"
        disabled={!settings.email ||
            !isValidEmail(settings.email) ||
            settings.loading}
        on:click={() => saveSettings()}
    >
        {#if settings.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <Check size={16} /> Save
        {/if}
    </button>
</div>
