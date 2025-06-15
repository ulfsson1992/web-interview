import mongoose from "mongoose";

const TodoListSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});

export const TodoListModel = mongoose.model('TodoList', TodoListSchema);