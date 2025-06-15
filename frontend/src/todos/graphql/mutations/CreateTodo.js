import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation AddTodo($listId: ID!, $title: String!) {
    addTodo(listId: $listId, title: $title) {
      id
      title
      completed
      dueDate
      listId
    }
  }
`;