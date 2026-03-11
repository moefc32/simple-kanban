import token from '$lib/server/token';
import Users from '$lib/server/db/model/users';

export async function load({ cookies, locals }) {
    const access_token = cookies.get(token.access);
    const decoded_token = token.decode(access_token);

    if (!decoded_token) return { ...locals };

    const userData = await Users
        .findById(decoded_token?.id)
        .select('-password').lean();

    return {
        ...locals,
        userData: userData && {
            ...userData,
            _id: userData._id.toString(),
        },
    };
}
