<script>
    import { toast } from 'svelte-sonner';
    import ky from 'ky';

    import Settings from '$lib/component/Settings.svelte';

    export let data;

    let { userData } = data;

    let settings = {
        name: userData.name,
        email: userData.email,
        password: '',
        loading: false,
    };

    async function saveSettings() {
        settings.loading = true;

        try {
            const result = await ky
                .patch('/api/auth', {
                    json: settings,
                })
                .json();
            settings.password = '';

            toast.success('Data saved successfully.');
            settings.loading = false;
        } catch (e) {
            settings.loading = false;

            console.error(e);
            toast.error('Save data failed, please try again!');
        }
    }
</script>

<main class="flex flex-1 flex-col justify-start items-center gap-6 p-6 w-full">
    <Settings {settings} {saveSettings} />
</main>
