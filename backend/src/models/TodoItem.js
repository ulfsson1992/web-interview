import mongoose from "mongoose";

export const TodoItemSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    dueDate: String,
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TodoList',
        required: true
    }
});

export const TodoItemModel = mongoose.model('TodoItem', TodoItemSchema);