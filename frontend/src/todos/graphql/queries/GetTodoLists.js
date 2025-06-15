import { gql } from '@apollo/client';

export const GET_TODO_LISTS = gql`
    query {
        todoLists {
            id
            title
            completed
            todos {
                id
                title
                completed
                dueDate
                listId
            }
        }
    }
`;