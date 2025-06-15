import { TodoItemModel } from "../models/TodoItem.js";
import { TodoListModel } from "../models/TodoList.js";

const resolvers = {
    Query: {
        todoLists: async () => {
            return await TodoListModel.find();
        }
    },

    TodoList: {
        todos: async (parent) => {
            return await TodoItemModel.find({ listId: parent._id });
        },
    },

    Mutation: {
        createTodoList: async (_, { title }) => {
            const todoList = new TodoListModel({ title, completed: false });
            return await todoList.save();
        },

        updateTodoList: async (_, { id, title }) => {
            return await TodoListModel.findByIdAndUpdate(id, { title }, { new: true });
        },

        deleteTodoList: async (_, { id }) => {
            const result = await TodoListModel.findByIdAndDelete(id);
            return !!result;
        },

        addTodo: async (_, { listId, title, dueDate }) => {
            const todoItem = new TodoItemModel({ title, completed: false, dueDate, listId });
            await todoItem.save();
            await TodoListModel.findByIdAndUpdate(listId, { $push: { todos: todoItem._id } });
            return todoItem;
        },

        updateTodo: async (_, { todoId, title, completed, dueDate }) => {
            return await TodoItemModel.findByIdAndUpdate(todoId, { title, completed, dueDate }, { new: true });
        },

        deleteTodo: async (_, { todoId }) => {
            const result = await TodoItemModel.findByIdAndDelete(todoId);
            return !!result;
        }
    }
};

export default resolvers;