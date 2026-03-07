import { VITE_APP_NAME } from '$env/static/private'
import { json, error } from '@sveltejs/kit';
import Backlogs from '$lib/server/db/model/backlogs';
import token from '$lib/server/token';

export async function GET({ url }) {
    try {
        const id = url.searchParams.get('id');
        const result = await Backlogs.findById(id).lean();

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}

export async function POST({ cookies, request }) {
    const access_token = cookies.get(token.access);
    const decoded_token = token.decode(access_token);

    const {
        title = '',
        detail = '',
        urgency = '',
        due_time = '',
        status = '',
    } = await request.json() || {};

    if (
        !title ||
        !urgency ||
        !due_time ||
        !status
    ) {
        return json({
            application: VITE_APP_NAME,
            message: 'All required data must be filled, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await Backlogs.create({
            user_id: decoded_token?.id,
            title,
            detail,
            urgency,
            due_time: new Date(due_time),
            status: status ?? 'TODO'
        });

        return json({
            application: VITE_APP_NAME,
            data: result,
        });
    } catch (e) {
        console.error(e);

        return json({
            application: VITE_APP_NAME,
            message: e,
        }, {
            status: 500,
        });
    }
}

export async function PATCH({ url, request }) {
    try {
        const id = url.searchParams.get('id');
        const {
            title = '',
            detail = '',
            urgency = '',
            due_time = '',
            status = '',
        } = await request.json() || {};

        const data = {};

        if (title) data.title = title;
        if (urgency) data.urgency = urgency;
        if (due_time) data.due_time = new Date(due_time);
        if (status) data.status = status;
        data.detail = detail;

        try {
            const result = await Backlogs
                .findByIdAndUpdate(id,
                    data, { returnDocument: 'after' },
                );

            return json({
                application: VITE_APP_NAME,
                data: result,
            });
        } catch (e) {
            console.error(e);

            return json({
                application: VITE_APP_NAME,
                message: e,
            }, {
                status: 500,
            });
        }
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}

export async function DELETE({ url }) {
    try {
        const id = url.searchParams.get('id');

        try {
            const result = await Backlogs
                .findByIdAndDelete(id);

            return json({
                application: VITE_APP_NAME,
                data: result
            });
        } catch (e) {
            console.error(e);

            return json({
                application: VITE_APP_NAME,
                message: e,
            }, {
                status: 500,
            });
        }
    } catch (e) {
        console.error(e);
        error(500, e);
    }
}
