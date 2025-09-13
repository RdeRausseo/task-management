import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./components/Task";
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* La ruta con "index" renderiza el componente Home en la ruta padre "/" */}
                <Route index element={<Home />} />
                {/*Protegemos la ruta Task para acceder solo si estamos loged*/}
                <Route path="task" element={<PrivateRoute> <Tasks/> </PrivateRoute>} />
            </Route>
            {/*Ruta para el login*/}
            <Route path="/login" element={<Login />} />
            {/*Ruta para el registro*/}
            <Route path="/register" element={<Register />} />

        </Routes>
    );
}

export default AppRoutes;