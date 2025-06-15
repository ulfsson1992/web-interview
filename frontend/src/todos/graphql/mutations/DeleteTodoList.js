import { gql } from "@apollo/client";

export const DELETE_TODO_LIST = gql`
    mutation DeleteTodoList($id: ID!) {
        deleteTodoList(id: $id) 
    }
`;