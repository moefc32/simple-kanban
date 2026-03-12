import { VITE_DATABASE_URL } from '$env/static/private';
import mongoose from 'mongoose';
import Users from './model/users'

const { connect, connection } = mongoose;

async function shutdown() {
    await connection.close();
    process.exit(0);
};

export async function initMongoDB() {
    if (connection.readyState === 1) return;

    try {
        const db = await connect(VITE_DATABASE_URL, {
            maxPoolSize: 20,
            minPoolSize: 2,
            waitQueueTimeoutMS: 10 * 1000,
            heartbeatFrequencyMS: 30 * 1000,
        });

        console.log('\n--- MongoDB Connected ---\n');
    } catch (e) {
        console.error('MongoDB connection error!', e);
    }
}

export async function checkIsUserExists(id) {
    if (!id) return false;

    const user = await Users.findById(id)
        .select('_id').lean();

    return !!user;
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
