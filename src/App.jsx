import { useEffect, useState } from "react";
import TodoFooter from "./components/TodoFooter";
import TodoForm from "./components/TodoForm";
import Todos from "./components/Todos";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [order, setOrder] = useState("asc");

  const getTodos = async (page = 1, order = "asc", limit = 5) => {
    const response = await fetch(
      `${BASE_URL}/todos?page=${page}&limit=${limit}&order=${order}`
    );

    const { results, total_pages, next, previous } = await response.json();

    setTodos(results);
    setTotalPages(total_pages);
    setNext(next);
    setPrevious(previous);
  };

  useEffect(() => {
    getTodos(page, order);
  }, [page, order]);

  const addTodo = async (title) => {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    console.log({
      response,
    });
    await response.json();
    await getTodos();
  };

  const removeTodo = async (id) => {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }
    await getTodos();
  };

  const updateTodo = async (id) => {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
    });
    if (response.status !== 200) {
      return alert("Something went wrong");
    }
    await getTodos();
  };

  return (
    <div className="container">
      <h1 className="my-5">Todos APP</h1>
      <TodoForm addTodo={addTodo} />
      <Todos
        todos={todos}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
      <TodoFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        next={next}
        previous={previous}
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
};
export default App;
