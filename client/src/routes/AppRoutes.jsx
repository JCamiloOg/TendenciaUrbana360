import { Routes, Route, Router } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Error from "../pages/Error";
import AuthUser from "../pages/AuthUser";
import Profile from "../pages/Profile";
import Product from "@/pages/Product";
import ProductsByCategory from "@/pages/ProductsByCategory";
import Order from "@/pages/Order";
import Modify from "@/pages/Modify";
import SearchProducts from "@/pages/SearchProducts";
import AdminProducts from "@/pages/Admin/Products";
import Sizes from "@/pages/Admin/sizes";
import Types from "@/pages/Admin/types";
import Genders from "@/pages/Admin/genders";
import Colors from "@/pages/Admin/colors";
import Orders from "@/pages/Admin/orders";
import Clients from "@/pages/Admin/clients";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/clients/profile" element={<Profile />} />
            <Route path="/clients/order/:step" element={<Order />} />
            <Route path="/clients/profile/modify" element={<Modify />} />
            <Route path="/login/success" element={<AuthUser />} />
            <Route path="/products/search/:category?" element={<SearchProducts />} />
            <Route path="/products/:type" element={<ProductsByCategory />} />
            <Route path="/products/:type/:id" element={<Product />} />

            {/* Admin routes */}
            <Route path="/admin/clients" element={<Clients />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/colors" element={<Colors />} />
            <Route path="/admin/genders" element={<Genders />} />
            <Route path="/admin/types" element={<Types />} />
            <Route path="/admin/sizes" element={<Sizes />} />
            <Route path="/admin/:category" element={<AdminProducts />} />
            <Route path="*" element={<Error status={404} error={"Página no encontrada."} />} />
        </Routes>
    )
}