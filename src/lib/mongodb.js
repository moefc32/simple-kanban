import { MongoClient } from 'mongodb';

const MONGO_USER = import.meta.env.MONGO_USER;
const MONGO_PASS = import.meta.env.MONGO_PASS;
const MONGO_HOST = import.meta.env.MONGO_HOST;
const MONGO_PORT = import.meta.env.MONGO_PORT;
const MONGO_DB = import.meta.env.MONGO_DB;

const mongoURL = (MONGO_USER && MONGO_PASS)
    ? `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
    : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
const mongoClient = new MongoClient(mongoURL);

export default mongoClient;
