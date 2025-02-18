import { VITE_APP_NAME } from '$env/static/private'
import { json, error } from '@sveltejs/kit';
import model from '$lib/model/backlog';

export async function GET() {
    try {
        const result = await model.getData();
        const items = {
            to_do: [],
            in_progress: [],
            in_review: [],
            done: [],
        };
        const urgencyOrder = {
            'urgent': 1,
            'medium': 2,
            'low': 3
        };

        const sortedResult = result.sort((a, b) => {
            if (a.progress < b.progress) return -1;
            if (a.progress > b.progress) return 1;

            return (urgencyOrder[a.urgency] || 99) - (urgencyOrder[b.urgency] || 99);
        });

        sortedResult.forEach(item => {
            const progressCategory = item.progress || 'to_do';

            if (items[progressCategory]) {
                items[progressCategory].push(item);
            } else {
                items['to_do'].push(item);
            }
        });

        return json({
            application: VITE_APP_NAME,
            data: items,
        });
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}

export async function POST({ request }) {
    try {
        const {
            title = '',
            detail = '',
            urgency = '',
            due = '',
            progress = '',
        } = await request.json() || {};

        if (title && urgency && due && progress) {
            const dueDate = new Date(due);
            const data = {
                title,
                detail,
                urgency,
                due: parseInt(dueDate.getTime(), 10),
                progress: progress ?? 'to_do',
            };
            const result = await model.createData(data);

            return json({
                application: VITE_APP_NAME,
                data: result,
            });
        }

        error(400, e);
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}

export async function PATCH({ url, request }) {
    try {
        const id = url.searchParams.get('id');
        const {
            title = '',
            detail = '',
            urgency = '',
            due = '',
            progress = '',
        } = await request.json() || {};
        const dueDate = due && new Date(due);

        const data = {};
        if (title) data.title = title;
        if (urgency) data.urgency = urgency;
        if (due) data.due = parseInt(dueDate.getTime(), 10);
        if (progress) data.progress = progress;
        data.detail = detail;

        const result = await model.editData(id, data);

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}

export async function DELETE({ url }) {
    try {
        const id = url.searchParams.get('id');

        if (id) {
            const result = await model.deleteData(id);

            return json({
                application: VITE_APP_NAME,
                data: result,
            });
        }

        error(400, e);
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}
