import { gql } from "@apollo/client";

export const ADD_TODO = gql`
  mutation AddingTodos($title: String!, $tags: [String]!) {
    addTodo(title: $title, tags: $tags) {
      id
      title
      completed
      tags
    }
  }
`;
