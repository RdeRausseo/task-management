import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">
          <Link to="/">Task Manager</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Inicio</Link>
          {isAuthenticated ? (
            <>
              <Link to="/task" className="hover:underline">Mis tareas</Link>
              <span className="ml-2">👤 {user?.username}</span>
              <button
                onClick={logout}
                className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Registro</Link>
            </>
          )}
        </nav>
      </header>

      {/* Contenido dinámico, SIEMPRE centrado */}
      <main className="flex-grow flex items-center justify-center p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-3 text-sm">
        © {new Date().getFullYear()} Task Manager
      </footer>
    </div>
  );
}
