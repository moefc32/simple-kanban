export async function load({ parent }) {
    const pageTitle = 'Settings';
    const { userData } = await parent();

    return {
        pageTitle,
        userData,
    };
}
