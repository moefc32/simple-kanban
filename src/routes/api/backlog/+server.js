import { VITE_APP_NAME } from '$env/static/private'
import { json, error } from '@sveltejs/kit';
import model from '$lib/api/backlog';

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

export async function POST() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const { title = '', detail = '', urgency = '' } = req.body || {};

    if (title && detail && urgency) {
        const data = { title, detail, urgency };
        const result = await model.createData(data);

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    }

    return await res.status(400).send({
        application: VITE_APP_NAME,
    });
}

export async function PATCH() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const id = req.params.id;
    const { title = '', detail = '', urgency = '' } = req.body || {};
    const data = {};

    if (title) data.title = title;
    if (detail) data.detail = detail;
    if (urgency) data.urgency = urgency;

    const result = await model.editData(id, data);

    return json({
        application: VITE_APP_NAME,
        data: result,
    });
}

export async function DELETE() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const id = req.params.id;
    const result = await model.deleteData(id);

    return json({
        application: VITE_APP_NAME,
        data: result,
    });
}
