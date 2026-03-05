import { redirect } from '@sveltejs/kit';
import { initMongoDB, checkIsUserExists } from '$lib/server/db/mongoose';
import token from '$lib/server/token';

initMongoDB();

const PUBLIC_ROUTES = [];
const UNAUTH_ROUTES = ['/login', '/register'];
const PUBLIC_API_ROUTES = ['/api/auth'];

function isRouteMatch(routes, path) {
    return routes.some((route) => path.startsWith(route));
}

export const handle = async ({ event, resolve }) => {
    const { cookies, url } = event;
    const currentPath = url.pathname;
    const isTokenValid = token.validate(cookies);

    const lang = cookies.get('lang');
    const validLang = lang && ['en', 'id'].includes(lang);

    if (!validLang) {
        cookies.set('lang', 'en', {
            path: '/',
            httpOnly: true,
        });
    }

    event.locals.lang = validLang ? lang : 'en';
    event.locals.publicRoutes = PUBLIC_ROUTES;
    event.locals.unauthRoutes = UNAUTH_ROUTES;

    if (isTokenValid) {
        cookies.set('__session_active', '1', {
            path: '/',
            httpOnly: false,
        });
    } else {
        cookies.delete('__session_active', {
            path: '/',
        });
    }

    let user = null;
    let isAuthenticated = false;

    if (isTokenValid) {
        user = await checkIsUserExists(isTokenValid.id);
        isAuthenticated = !!user;
    }

    if (!isAuthenticated) {
        token.purge(cookies, [
            'access_token',
            'refresh_token',
        ]);

        if (
            isRouteMatch(PUBLIC_ROUTES, currentPath) ||
            isRouteMatch(UNAUTH_ROUTES, currentPath) ||
            isRouteMatch(PUBLIC_API_ROUTES, currentPath)
        ) {
            return resolve(event);
        }

        throw redirect(303, '/login');
    }

    if (isRouteMatch(UNAUTH_ROUTES, currentPath)) {
        throw redirect(303, '/');
    }

    return resolve(event);
};
