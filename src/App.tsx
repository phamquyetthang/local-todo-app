import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface ITodo {
  id: number;
  title: string;
  isDone: boolean;
}

const reorder = (list: ITodo[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const newTodos = reorder(
      todos,
      result.source.index,
      result.destination.index
    );
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  return (
    <div className="bg-white flex h-full w-full flex-col p-10">
      <div className=" gap-4 mb-4 flex">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border shadow p-1 h-10 w-1/3 min-w-[250px] outline-none rounded"
          onKeyDown={(e) => e.key === "Enter" && createTodo()}
        />
        <button
          onClick={createTodo}
          disabled={!input}
          className="p-2 max-h-10 rounded shadow bg-blue-400"
        >
          Create
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2"
            >
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={String(todo.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      key={todo.id}
                      className="p-4 border shadow rounded flex  justify-between flex-row items-center cursor-pointer"
                      onClick={() => onChangeStatus(todo.id)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="flex gap-2 flex-row items-center ">
                        <input
                          type="checkbox"
                          className="bg-white"
                          checked={todo.isDone}
                          onChange={() => onChangeStatus(todo.id)}
                        />
                        <p
                          className={`text-black ${
                            todo.isDone ? "line-through" : ""
                          }`}
                        >
                          {todo.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this ?")) {
                              onDelete(todo.id);
                            }
                          }}
                          className="pl-2"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
