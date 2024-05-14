export async function load({ fetch }) {
    try {
        const response = await fetch('api/backlog');
        const { data } = await response.json();

        return {
            backlogData: data,
        };
    } catch (e) {
        console.error(e);

        return {
            backlogData: {
                to_do: [],
                in_progress: [],
                in_review: [],
                done: [],
            },
        };
    }
}
