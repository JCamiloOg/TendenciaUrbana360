import { Routes, Route, Router } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Error from "../pages/Error";
import AuthUser from "../pages/AuthUser";
import Profile from "../pages/Profile";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/clients/profile" element={<Profile />} />
            <Route path="/login/success" element={<AuthUser />} />
            <Route path="*" element={<Error status={404} error={"Página no encontrada."} />} />
        </Routes>
    )
}