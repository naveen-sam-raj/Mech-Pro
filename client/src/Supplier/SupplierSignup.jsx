import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const SupplierSignup = () => {
  const navigate = useNavigate();

  // ⭐ state (UI change illa)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // ⭐ submit function
  const handleSignup = async () => {
    try {
      const res = await API.post("/supplier/signup", {
          name,
          email,
          phone,
          password,
        },
      );

      alert(res.data.message || "Signup successful");
      navigate("/supplier-login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f5] px-4">
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* ================= LEFT IMAGE PANEL ================= */}
        <div className="hidden md:flex items-center justify-center bg-[#e3f1ec] p-8">
          <img
            src="/images/Sign up-bro.png"
            alt="Supplier Signup Illustration"
            className="max-w-md"
          />
        </div>

        {/* ================= FORM ================= */}
        <div className="p-8 md:p-10">
          {/* Close / Back */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>

          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Supplier Signup
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Register as a supplier (approval required)
          </p>

          {/* Form */}
          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Supplier Name / Company Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <input
              type="password"
              placeholder="Create Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <button
              onClick={handleSignup}
              className="w-full bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-600 text-center mt-5">
            Your account will be reviewed before approval.
          </p>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already registered?{" "}
            <span
              onClick={() => navigate("/supplier-login")}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierSignup;
