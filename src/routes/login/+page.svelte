<script>
    import { goto } from '$app/navigation';
    import axios from 'axios';
    import notyf from '$lib/notyf';

    import Login from '$lib/component/Login.svelte';

    export let data;

    let { contents } = data;

    let login = {
        email: '',
        password: '',
        loading: false,
    };

    async function doLogin() {
        login.loading = true;

        try {
            await axios.post('/api/auth', login);

            notyf.success('You have successfully logged in.');
            await goto('/', { invalidateAll: true });
        } catch (e) {
            login.loading = false;

            console.error(e);
            notyf.error('Login failed, please try again!');
        }
    }
</script>

<main
    class="flex flex-1 flex-col justify-center items-center gap-6 px-6 pt-6 pb-12 w-full"
>
    <Login {login} {doLogin} />
</main>
