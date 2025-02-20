import {
    VITE_MONGO_USER,
    VITE_MONGO_PASS,
    VITE_MONGO_HOST,
    VITE_MONGO_PORT,
    VITE_MONGO_DB,
    VITE_MONGO_AUTH_SOURCE,
} from '$env/static/private';
import { MongoClient } from 'mongodb';

let credentials = '';
let authSource = '';

if (VITE_MONGO_USER && VITE_MONGO_PASS) {
    credentials = `${VITE_MONGO_USER}:${VITE_MONGO_PASS}@`;
    authSource = `?authSource=${VITE_MONGO_AUTH_SOURCE}`;
}

const mongoURL = [
    'mongodb://',
    credentials,
    VITE_MONGO_HOST, ':', VITE_MONGO_PORT, '/',
    VITE_MONGO_DB,
    authSource
].join('');

export default new MongoClient(mongoURL);
