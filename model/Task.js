// models/Task.js
import mongoose, { models } from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    completed: { type: Boolean, default: false },
    insertedDate: {
        type: Date,
        default: Date.now,
      },
});

const Task = models.Task || mongoose.model('Task', taskSchema);

export default Task;
