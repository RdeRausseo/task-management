import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido — Task Manager</h1>
      
      <p>
        <Link to="/register" className="text-blue-400 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
