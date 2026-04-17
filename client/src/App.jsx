import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import About from "./About";
import Contact from "./Contact";
import emailjs from "@emailjs/browser";
import AdminLogin from "./admin/AdminLogin";
// import AdminDashboard from "./admin/AdminDashboard";

import Navbar from "./Navbar";

import SupplierLogin from "./Supplier/SupplierLogin";
import SupplierSignup from "./Supplier/SupplierSignup";
import SupplierDashboard from "./Supplier/SupplierDashboard";
import AddProduct from "./Supplier/AddProduct";
import MyProducts from "./Supplier/MyProducts";
import EditProduct from "./Supplier/EditProduct";

import CategoryView from "./CategoryView";
import CategoryProducts from "./CategoryProducts";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import ProductDetail from "./ProductDetail";
import MyOrders from "./MyOrders";

import productsData from "./db";

// Layout that wraps all customer-facing pages with the Navbar
const CustomerLayout = () => (
  <div className="bg-[#f2f7f5] text-gray-800 min-h-screen">
    <Navbar />
    <Outlet />
  </div>
);

const App = () => {
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(productsData));
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, []);

  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

  return (
    <Routes>
      {/* ===== CUSTOMER PAGES (with Navbar) ===== */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<CategoryProducts />} />
        <Route path="/category/:category" element={<CategoryView />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      {/* ===== SUPPLIER PAGES (no customer Navbar) ===== */}
      <Route path="/supplier-login" element={<SupplierLogin />} />
      <Route path="/supplier-signup" element={<SupplierSignup />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/myproducts" element={<MyProducts />} />
      <Route path="/editproduct/:id" element={<EditProduct />} />

      {/* ===== ADMIN PAGES (no customer Navbar) ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
    </Routes>
  );
};

export default App;
