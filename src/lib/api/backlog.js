export default {
    getData: async () => {
        const response = await fetch('/api/backlog');
        return await response.json();
    },
}