<script>
    import { goto } from '$app/navigation';
    import axios from 'axios';
    import notyf from '$lib/notyf';

    import Register from '$lib/component/Register.svelte';

    export let data;

    let { contents } = data;

    let register = {
        name: '',
        email: '',
        password: '',
        loading: false,
    };

    async function doRegister() {
        register.loading = true;

        try {
            await axios.put('/api/auth', register);

            notyf.success('New user account registered successfully.');
            await goto('/', { invalidateAll: true });
        } catch (e) {
            register.loading = false;

            console.error(e);
            notyf.error('Register failed, please try again!');
        }
    }
</script>

<main
    class="flex flex-1 flex-col justify-center items-center gap-6 px-6 pt-6 pb-12 w-full"
>
    <Register {register} {doRegister} />
</main>
