import { gql } from '@apollo/client';

export const UPDATE_TODO = gql`
    mutation UpdateTodo($todoId: ID!, $title: String, $completed: Boolean, $dueDate: String) {
        updateTodo(todoId: $todoId, title: $title, completed: $completed, dueDate: $dueDate) {
            id
            title
            completed
            dueDate
            listId
        }
    }
`;