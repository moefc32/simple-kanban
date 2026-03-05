import { model, Schema } from 'mongoose';

export default model(
    'Users',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    }, {
        versionKey: false,
    })
);
