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

        await result.forEach(item => {
            items[item.progress || 'to_do'].push(item);
        });

        return json({
            application: VITE_APP_NAME,
            data: items,
        });
    } catch (e) {
        error(500, e);
    }
}

export async function POST({ request }) {
    try {
        const { title = '', detail = '', urgency = '' } = await request.json() || {};

        if (title && detail && urgency) {
            const data = { title, detail, urgency };
            const result = await model.createData(data);

            return json({
                application: VITE_APP_NAME,
                data: result,
            });
        }

        error(400, e);
    } catch (e) {
        error(500, e);
    }
}

export async function PATCH({ params, request }) {
    try {
        const { id } = params;
        const { title = '', detail = '', urgency = '' } = await request.json() || {};
        const data = {
            title: title ?? undefined,
            detail: detail ?? undefined,
            urgency: urgency ?? undefined,
        };
        const result = await model.editData(id, data);

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        error(500, e);
    }
}

export async function DELETE({ params }) {
    try {
        const { id } = params;
        const result = await model.deleteData(id);

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        error(500, e);
    }
}
