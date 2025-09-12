// src/routes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Importa todos tus otros componentes de página

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* La ruta con "index" renderiza el componente Home en la ruta padre "/" */}
                <Route index element={<Home />} />
            </Route>
            {/*Ruta para el login*/}
            <Route path="/login" element={<Login />} />
            {/*Ruta para el registro*/}
            <Route path="/register" element={<Register />} />

        </Routes>
    );
}

export default AppRoutes;