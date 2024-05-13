const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = require('./configs');
const { MongoClient } = require('mongodb');

const mongoURL = (MONGO_USER && MONGO_PASS)
    ? `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
    : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
const mongoClient = new MongoClient(mongoURL);

module.exports = mongoClient;
