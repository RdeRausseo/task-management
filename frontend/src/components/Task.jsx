import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Task() {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(true);

    const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

    async function fetchTasks() {
        try {
            const res = await fetch(`${BASE}/tasks`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error cargando tareas");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    async function handleAddTask(e) {
        e.preventDefault();
        if (!newTask.trim()) return;
        try {
            const res = await fetch(`${BASE}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ label: newTask }),
            });
            if (!res.ok) throw new Error("Error creando tarea");
            await res.json();
            setNewTask("");
            fetchTasks(); 
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteTask(id) {
        try {
            const res = await fetch(`${BASE}/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error eliminando tarea");
            fetchTasks(); 
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <p>Cargando tareas...</p>;

    return (
        <div className="max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Mis Tareas</h2>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Nueva tarea..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="border px-2 py-1 rounded flex-grow"
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-1 rounded"
                >
                    Agregar
                </button>
            </form>

            {tasks.length === 0 ? (
                <p>No tienes tareas.</p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map((t) => (
                        <li
                            key={t.id}
                            className="flex justify-between items-center border px-3 py-2 rounded"
                        >
                            <span>{t.label}</span>
                            <button
                                onClick={() => handleDeleteTask(t.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
