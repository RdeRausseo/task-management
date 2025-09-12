import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Bienvenido — Task Manager</h1>
      <p className="mb-4">Prueba la app: <Link to="/login" className="text-blue-400">Entrar</Link></p>
      <p><Link to="/register" className="text-blue-400">Crear cuenta</Link></p>
    </div>
  );
}
