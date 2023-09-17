import { useEffect, useState } from "react";

interface ITodo {
  id: number;
  title: string;
  isDone: boolean;
}

function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<ITodo[]>([]);

  const createTodo = () => {
    const newTodos = todos.concat({
      id: new Date().getTime(),
      title: input,
      isDone: false,
    });
    setInput("");
    setTodos(newTodos);

    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const todoRaw = localStorage.getItem("todos");

  useEffect(() => {
    setTodos(
      JSON.parse(todoRaw || "[]").map((i: ITodo) => ({
        ...i,
        id: Number(i.id),
      }))
    );
  }, [todoRaw]);

  const onChangeStatus = (id: number) => {
    const newTodos = todos.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          isDone: !i.isDone,
        };
      }
      return i;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const onDelete = (id: number) => {
    const newTodos = todos.filter((i) => i.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  return (
    <div className="bg-white flex h-full w-full flex-col p-10">
      <div className=" gap-4 mb-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border shadow p-2 w-96 outline-none rounded"
        />
        <button
          onClick={createTodo}
          disabled={!input}
          className="p-2 rounded shadow bg-blue-400"
        >
          Create
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="p-4 border shadow rounded flex  justify-between flex-row items-center cursor-pointer"
            onClick={() => onChangeStatus(todo.id)}
          >
            <div className="flex gap-2 flex-row items-center ">
              <input
                type="checkbox"
                className="bg-white"
                checked={todo.isDone}
                onChange={() => onChangeStatus(todo.id)}
              />
              <p className={`text-black ${todo.isDone ? "line-through" : ""}`}>
                {" "}
                {todo.title}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
