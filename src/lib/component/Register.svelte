<script>
    import { Eye, EyeOff, Check } from 'lucide-svelte';
    import isValidEmail from '$lib/isValidEmail';

    export let register;
    export let doRegister;

    let showPassword = false;

    async function handleKeydown(event) {
        if (
            event.key === 'Enter' &&
            register.name &&
            register.email &&
            register.password
        ) {
            doRegister();
        }
    }
</script>

<div
    class="card flex flex-col gap-2 my-auto p-6 bg-white w-full max-w-[320px] shadow-xl -top-6"
>
    <h1 class="my-2 text-3xl text-center">{import.meta.env.VITE_APP_NAME}</h1>
    <input
        type="text"
        class="input input-bordered w-full"
        placeholder="User name"
        bind:value={register.name}
        on:keydown={handleKeydown}
    />
    <input
        type="email"
        class="input input-bordered w-full"
        placeholder="Email"
        bind:value={register.email}
        on:keydown={handleKeydown}
    />
    <label class="input input-bordered flex items-center gap-2 w-full">
        {#if !showPassword}
            <input
                type="password"
                class="grow"
                placeholder="Password"
                bind:value={register.password}
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
                bind:value={register.password}
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
        title="Register new user account"
        disabled={(!register.name && !register.email) ||
            !isValidEmail(register.email) ||
            !register.password ||
            register.loading}
        on:click={() => doRegister()}
    >
        {#if register.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <Check size={16} /> Register
        {/if}
    </button>
    <div class="text-gray-500 text-sm text-center">
        Already have an account?
        <a href="/login" class="text-emerald-700">Login</a>
    </div>
</div>
