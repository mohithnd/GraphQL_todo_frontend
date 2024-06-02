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

    setTitle("");
    setTags("");
  }

  return (
    <>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div>
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
              GraphQL Powered Todo App
            </h1>
          </div>

          <form onSubmit={handleAddTodo} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
              />
            </div>

            <div>
              <input
                type="text"
                value={tags}
                placeholder="Comma Separated Tags"
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:bg-gradient-to-l hover:from-pink-500 hover:to-purple-500 transition-colors duration-300"
              >
                Add Todo
              </button>
            </div>
          </form>

          <ul className="mt-6 space-y-2">
            {data?.getTodos.length > 0 ? (
              data.getTodos.map((todo: ITodo) => (
                <li
                  key={todo.id}
                  className="py-3 px-4 bg-gray-100 rounded-lg flex items-center justify-between"
                >
                  <span className="text-gray-800">
                    {todo.title}
                    {todo.tags.length > 0 ? " - " : ""}
                    {todo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-center">No Todos Till Now</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Todo;
