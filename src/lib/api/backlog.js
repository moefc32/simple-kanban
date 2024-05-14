import { ObjectId } from 'mongodb';
import mongoClient from '../mongodb';

const collection = mongoClient.db().collection('backlog');

export default {
    getData: async () => {
        try {
            const result = await collection.find().toArray();
            return result;
        } catch (e) {
            console.error(e);
        }
    },
}
