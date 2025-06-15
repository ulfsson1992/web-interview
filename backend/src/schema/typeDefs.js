import { gql } from "apollo-server-express";

const typeDefs = gql`
    type TodoList {
        id: ID!
        title: String!
        todos: [Todo!]!
        completed: Boolean!
    }

    type Todo {
        id: ID!
        title: String!
        completed: Boolean!
        dueDate: String
        listId: ID!
    }

    type Query {
        todoLists: [TodoList!]!
    }

    type Mutation {
        createTodoList(title: String!): TodoList!
        updateTodoList(id: ID!, title: String!): TodoList!
        deleteTodoList(id: ID!): Boolean!
        addTodo(listId: ID!, title: String!, dueDate: String): Todo!
        updateTodo(todoId: ID!, title: String, completed: Boolean, dueDate: String): Todo!
        deleteTodo(todoId: ID!): Boolean!
    }
`;

export default typeDefs;