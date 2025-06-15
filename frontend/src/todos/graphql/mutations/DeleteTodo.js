import { gql } from "@apollo/client";

export const DELETE_TODO = gql`
    mutation DeleteTodo($todoId: ID!) {
        deleteTodo(todoId: $todoId) 
    }
`;