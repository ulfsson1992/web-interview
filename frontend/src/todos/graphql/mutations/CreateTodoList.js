import { gql } from '@apollo/client';

export const CREATE_TODO_LIST = gql`
  mutation CreateTodoList($title: String!) {
    createTodoList(title: $title) {
      id
      title
      completed
      todos {
        id
        title
        completed
        dueDate
      }
    }
  }
`;