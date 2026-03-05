<script>
    import { Eye, EyeOff, LogIn } from 'lucide-svelte';
    import isValidEmail from '$lib/isValidEmail';

    export let login;
    export let doLogin;

    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && login.email && login.password) {
            doLogin();
        }
    }
</script>

<div
    class="card flex flex-col gap-2 my-auto p-6 bg-white w-full max-w-[320px] shadow-xl -top-6"
>
    <h1 class="my-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
    <input
        type="email"
        class="input input-bordered w-full"
        placeholder="Email"
        bind:value={login.email}
        on:keydown={handleKeydown}
    />
    <label class="input input-bordered flex items-center gap-2 w-full">
        {#if !showPassword}
            <input
                type="password"
                class="grow"
                placeholder="Password"
                bind:value={login.password}
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
                placeholder="Password"
                bind:value={login.password}
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
        class="btn btn-primary mt-2"
        title="Login to application"
        disabled={!login.email ||
            !isValidEmail(login.email) ||
            !login.password ||
            login.loading}
        on:click={() => doLogin()}
    >
        {#if login.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <LogIn size={16} /> Login
        {/if}
    </button>
    <div class="text-gray-500 text-sm text-center">
        Don't have an account?
        <a href="/register" class="text-emerald-700">Register</a>
    </div>
</div>
