import { VITE_APP_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET() {
    return json({
        application: VITE_APP_NAME,
        message: 'Application is running.',
    });
}
