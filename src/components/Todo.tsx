import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ADD_TODO } from "../graphql/mutations";
import { v4 as UUIDV4 } from "uuid";
import { GET_TODOS } from "../graphql/query";
import { GetTodosData, ITodo } from "../types/Todo";

const Todo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const [addTodo] = useMutation(ADD_TODO, {
    optimisticResponse: {
      addTodo: {
        id: UUIDV4(),
        title: title,
        completed: false,
        tags: tags.split(",").map((tag) => tag.trim()),
      },
    },

    update: (cache, { data: { addTodo } }) => {
      console.log("Update Function", addTodo);

      const existingTodos = cache.readQuery<GetTodosData>({
        query: GET_TODOS,
      }) || { getTodos: [] };
      console.log("Existing Todos", existingTodos);

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          getTodos: [...existingTodos.getTodos, addTodo],
        },
      });
    },
  });

  const { data } = useQuery(GET_TODOS);

  function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();

    addTodo({
      variables: {
        title,
        tags: tags.split(",").map((tag) => tag.trim()),
      },
    });
  }

  return (
    <>
      <div>
        <h1>GraphQL Powered Todo App</h1>
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            type="text"
            value={tags}
            placeholder="Comma Separated Tags"
            onChange={(e) => {
              setTags(e.target.value);
            }}
          />
          <button type="submit">Add Todo</button>
        </form>
        <ul>
          {data?.getTodos.length > 0
            ? data.getTodos.map((todo: ITodo) => (
                <li key={todo.id}>
                  {todo.title} - {todo.tags.map((tag) => ` ${tag} `)}
                </li>
              ))
            : "No Todos Till Now"}
        </ul>
      </div>
    </>
  );
};

export default Todo;
