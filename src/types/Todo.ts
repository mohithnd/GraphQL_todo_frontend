export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
  tags: string[];
}

export interface GetTodosData {
  getTodos: ITodo[];
}
