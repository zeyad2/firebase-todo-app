import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [todoStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const todosCollection = collection(db, "todo");
  

  const createTodo = async () => {
    if (!todoText.trim()) {
      alert("Please enter a todo");
      return;
    }

    try {
      await addDoc(todosCollection, { Name: todoText, Status: todoStatus });
      setTodoText("");
      // Refresh the todos list
      const data = await getDocs(todosCollection);
      const todosData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(todosData);
    } catch (error) {
      console.error(error);
    }
  };





  useEffect(() => {
    const getTodos = async () => {
      try {
        const data = await getDocs(todosCollection);
        console.log(data);
        const todosData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTodos(todosData);
      } catch (error) {
        console.error(error);
      }
    };

    getTodos();
  }, [todosCollection]);

  const updateTodo = async (id, Name, Status) => {
    const newTodo = { Name, Status };
    try {
      const todoDoc = doc(db, "todo", id);
      await updateDoc(todoDoc, newTodo);

      const data = await getDocs(todosCollection);
      const todosData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(todosData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.Name);
  };

  const handleSaveEdit = async (id, Status) => {
    if (!editText.trim()) {
      alert("Todo text cannot be empty");
      return;
    }
    await updateTodo(id, editText, Status);
    setEditingId(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const toggleStatus = async (id, Name, currentStatus) => {
    await updateTodo(id, Name, !currentStatus);
  };

  const deleteTodo = async (id) => {
    try {
      const todo = doc(db, "todo", id);
      await deleteDoc(todo);
      const data = await getDocs(todosCollection);
       const todosData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(todosData);
    } catch (error) {
      console.error(error);

    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todos</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new todo..."
              value={todoText}
              onChange={(event) => {
                setTodoText(event.target.value);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  createTodo();
                }
              }}
            />
            <button
              onClick={createTodo}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTodos.length === 0 && todos.length === 0 && (
            <div className="text-center py-12 text-gray-500">No todos</div>
          )}

          {filteredTodos.length === 0 && todos.length > 0 && (
            <div className="text-center py-12 text-gray-500">No todos</div>
          )}

          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white border border-gray-200 rounded p-4"
            >
              {editingId === todo.id ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(todo.id, todo.Status)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.Status}
                    onChange={() =>
                      toggleStatus(todo.id, todo.Name, todo.Status)
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      todo.Status
                        ? "line-through text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {todo.Name}
                  </span>
                  <div>
                    <button
                      className="mx-6 text-green-600 hover:text-green-700"
                      onClick={() => handleEditClick(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-700 hover:text-red-800"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
