import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export default function Tasks() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTasks(await res.json());
      }
    })();
  }, [token]);

  async function addTask(e) {
    e.preventDefault();
    const res = await fetch(`${BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ label: newTask }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask("");
    }
  }

  async function toggleTask(id, completed) {
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
    }
  }

  async function deleteTask(id) {
    const res = await fetch(`${BASE}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis tareas</h2>
      <form onSubmit={addTask} className="mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-1 rounded">
          Agregar
        </button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t.id} className="flex justify-between items-center border-b py-2">
            <span
              onClick={() => toggleTask(t.id, t.completed)}
              className={t.completed ? "line-through cursor-pointer" : "cursor-pointer"}
            >
              {t.label}
            </span>
            <button
              onClick={() => deleteTask(t.id)}
              className="text-red-500 ml-4"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <button onClick={logout} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  );
}
