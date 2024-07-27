import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  const toggleFinished = () => setShowFinished(!showFinished);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    console.log("Retrieved todos from localStorage:", todoString); // Debugging line
    if (todoString) {
      try {
        const savedTodos = JSON.parse(todoString);
        if (Array.isArray(savedTodos)) {
          setTodos(savedTodos);
          console.log("Parsed todos:", savedTodos); // Debugging line
        }
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    } else {
      console.log("No todos found in localStorage"); // Debugging line
    }
  }, []);

  useEffect(() => {
    console.log("Saving todos to localStorage:", todos); // Debugging line
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  const handleEdit = (id) => {
    const t = todos.find((i) => i.id === id);
    setTodo(t.todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleAdd = () => {
    if (todo.trim()) {
      const newTodo = { id: uuidv4(), todo: todo.trim(), isCompleted: false };
      setTodos([...todos, newTodo]);
      console.log("Added new todo:", newTodo); // Debugging line
      setTodo("");
    }
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl bg-blue-300 min-h-[85vh] p-5 max-w-[50vw]">
        <div className="addTodo my-5">
          <h2 className="text-2xl my-2 font-bold">Add a Todo</h2>
          <input
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={todo}
            type="text"
            className="w-[87%] rounded-md p-1"
          />
          <button
            onClick={handleAdd}
            className="bg-cyan-400 hover:bg-cyan-500 p-3 py-1 rounded-lg font-semibold mx-4"
          >
            Add
          </button>
        </div>
        <label className="flex items-center space-x-2 my-3">
          <input
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
          />
          <span>Show Finished Todos</span>
        </label>
        <hr />
        <h1 className="text-xl font-bold">Your Todos</h1>
        <div className="todos">
          {todos.length === 0 && (
            <div className="my-2">No todos to display</div>
          )}
          {todos
            .filter((item) => showFinished || !item.isCompleted)
            .map((item) => (
              <div
                key={item.id}
                className="todo flex justify-between w-[98%] my-3"
              >
                <div className="flex gap-5">
                  <input
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                    name={item.id}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>
                    <div className="my-0.5 text-lg">{item.todo}</div>
                  </div>
                </div>
                <div className="buttons">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-cyan-400 hover:bg-cyan-500 p-3 py-1 rounded-lg text-2xl mx-1"
                  >
                    <MdDelete />
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-cyan-400 hover:bg-cyan-500 p-3 py-1 rounded-lg text-2xl mx-1"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
