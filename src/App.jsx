import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import About from "./About";
import Contact from "./Contact";
import emailjs from "@emailjs/browser";
import AdminLogin from "./admin/AdminLogin";
// import AdminDashboard from "./admin/AdminDashboard";


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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}

      {/* CUSTOMER */}
      <Route path="/categories" element={<CategoryProducts />} />
      <Route path="/category/:category" element={<CategoryView />} />

      {/* SUPPLIER */}
      <Route path="/supplier-login" element={<SupplierLogin />} />
      <Route path="/supplier-signup" element={<SupplierSignup />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/addproduct" element={<AddProduct />} />
      <Route path="/myproducts" element={<MyProducts />} />
      <Route path="/editproduct/:id" element={<EditProduct />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </Routes>
  );
};

export default App;
