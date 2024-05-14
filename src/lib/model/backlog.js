import { ObjectId } from 'mongodb';
import mongoClient from '../mongodb';

const backlogCollection = mongoClient.db().collection('backlog');

export default {
    getData: async () => {
        try {
            const result = await backlogCollection.find().toArray();
            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting backlogs!');
        }
    },
    createData: async (data) => {
        try {
            const result = await backlogCollection.insertOne({
                ...data,
                progress: 'to_do',
            });

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating backlog!');
        }
    },
    editData: async (id, data) => {
        try {
            const result = await backlogCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: data });

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when editing backlog!');
        }
    },
    deleteData: async (id) => {
        try {
            const result = await backlogCollection.deleteOne(
                { _id: new ObjectId(id) });

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting backlog!');
        }
    },
}
