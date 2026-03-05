import { model, Schema } from 'mongoose';

export const enums = Object.freeze({
    urgency: [
        { value: 'URGENT', label: 'Urgent' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LOW', label: 'Low' },
    ],
    status: [
        { value: 'TODO', label: 'To-Do' },
        { value: 'PROGRESS', label: 'In Progress' },
        { value: 'REVIEW', label: 'Under Review' },
        { value: 'DONE', label: 'Completed' },
    ]
});

export default model(
    'Backlogs',
    new Schema({
        title: {
            type: String,
            required: true,
        },
        detail: String,
        urgency: {
            type: String,
            required: true,
            enum: enums.urgency.map((u) => u.value),
            default: 'LOW',
        },
        status: {
            type: String,
            required: true,
            enum: enums.status.map((s) => s.value),
            default: 'TODO',
        },
        due_time: {
            type: Date,
            required: true,
        },
        created_at: Date,
        updated_at: Date,
    }, {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    })
);
