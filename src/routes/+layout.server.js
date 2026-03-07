import token from '$lib/server/token';
import Users from '$lib/server/db/model/users';

export async function load({ cookies, locals }) {
    const routes = {
        publicRoutes: locals.publicRoutes,
        unauthRoutes: locals.unauthRoutes,
    };
    const access_token = cookies.get(token.access);
    const decoded_token = token.decode(access_token);

    if (!decoded_token) return { ...routes };

    const userData = await Users
        .findById(decoded_token?.id)
        .select('-password').lean();

    return {
        ...routes,
        userData: userData && {
            ...userData,
            _id: userData._id.toString(),
        },
    };
}
