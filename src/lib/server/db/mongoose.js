import { VITE_DATABASE_URL } from '$env/static/private';
import { connect } from 'mongoose';
import Users from './model/users'

let isConnected = 0;

export async function initMongoDB() {
    if (isConnected) return;

    try {
        const db = await connect(VITE_DATABASE_URL);
        isConnected = db.connections[0].readyState === 1;
    } catch (e) {
        console.error('MongoDB connection error!', e);
    }
}

export async function checkIsUserExists(id) {
    if (!id) return false;

    const user = await Users.findById(id).lean();

    return !!user;
}
