import {
    VITE_APP_NAME,
    VITE_JWT_SECRET,
    VITE_JWT_EXPIRATION,
} from '$env/static/private';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import token from '$lib/server/token';
import Users from '$lib/server/db/model/users';
import {
    hashPassword,
    comparePassword,
} from '$lib/server/hash';
import isValidEmail from '$lib/isValidEmail';
import trimText from '$lib/trimText';
import parseMs from '$lib/parseMs';

export async function POST({ cookies, request }) {
    const {
        email = '',
        password = '',
    } = await request.json() || {};

    if (!email || !password) {
        return json({
            application: VITE_APP_NAME,
            message: 'All data must be filled, please try again!',
        }, {
            status: 400,
        });
    }

    if (!isValidEmail(email)) {
        return json({
            application: VITE_APP_NAME,
            message: 'Wrong email or password, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const lookData = await Users.findOne({
            email: email.toLowerCase(),
        }).lean();

        if (lookData) {
            const passwordMatch = await comparePassword(password, lookData.password);

            if (passwordMatch) {
                const jwtToken = token.sign({ id: lookData._id.toString() },
                    VITE_JWT_EXPIRATION || '1h');

                const maxAge = parseMs(VITE_JWT_EXPIRATION || '1h');
                token.set(cookies, 'access_token', jwtToken, { maxAge });

                return json({
                    application: VITE_APP_NAME,
                    message: 'Login success.',
                });
            }
        }

        return json({
            application: VITE_APP_NAME,
            message: 'Wrong email or password, please try again!',
        }, {
            status: 400,
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

export async function PATCH({ cookies, url, request }) {
    const {
        name = '',
        email = '',
        password = '',
    } = await request.json() || {};

    const access_token = cookies.get(token.access);
    const decoded_token = token.decode(access_token);

    try {
        const data = {};
        if (name) data.name = trimText(name);
        if (isValidEmail(email)) data.email = email.toLowerCase();
        if (password) data.password = await hashPassword(password);

        const result = await Users
            .findByIdAndUpdate(
                decoded_token?.id,
                data, { returnDocument: 'after' },
            );

        return json({
            application: VITE_APP_NAME,
            message: 'Update user account success.',
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

export async function PUT({ request }) {
    const {
        name = '',
        email = '',
        password = '',
    } = await request.json() || {};

    if (!name || !email || !password) {
        return json({
            application: VITE_APP_NAME,
            message: 'All data must be filled, please try again!',
        }, {
            status: 400,
        });
    }

    try {
        const result = await Users.create({
            name: trimText(name),
            email: email.toLowerCase(),
            password: await hashPassword(password),
        });

        return json({
            application: VITE_APP_NAME,
            message: 'Register new account success.',
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

export async function DELETE({ cookies }) {
    try {
        token.purge(cookies, 'access_token');

        return json({
            application: VITE_APP_NAME,
            message: 'Logout success.',
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
