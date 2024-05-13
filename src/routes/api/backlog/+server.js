import { error } from '@sveltejs/kit';
import model from '$lib/api/backlog';

export async function GET() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const result = await model.getData();
    const items = {
        toDo: [],
        inProgress: [],
        inReview: [],
        done: [],
    };

    await result.forEach(item => {
        items[item.progress || 'toDo'].push(item);
    });

    return await res.status(200).send({
        application: APP_NAME,
        data: items,
    });

    return new Response(String(random));
}

export async function POST() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const { title = '', detail = '', urgency = '' } = req.body || {};

    if (title && detail && urgency) {
        const data = { title, detail, urgency };
        const result = await model.createData(data);

        return await res.status(200).send({
            application: APP_NAME,
            data: result,
        });
    }

    return await res.status(400).send({
        application: APP_NAME,
    });

    return new Response(String(random));
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

    return await res.status(200).send({
        application: APP_NAME,
        data: result,
    });

    return new Response(String(random));
}

export async function DELETE() {
    // error(400, 'min and max must be numbers, and min must be less than max');

    const id = req.params.id;
    const result = await model.deleteData(id);

    return await res.status(200).send({
        application: APP_NAME,
        data: result,
    });

    return new Response(String(random));
}
