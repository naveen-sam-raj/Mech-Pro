import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:5000`;

const SupplierLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/supplier/login`, {
        email,
        password,
      });

      localStorage.setItem("supplierToken", res.data.token);
      navigate("/supplier-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f5] px-4">
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE PANEL */}
        <div className="hidden md:flex items-center justify-center bg-[#e3f1ec] p-8">
          <img
            src="https://illustrations.popsy.co/green/work-from-home.svg"
            alt="Supplier Login Illustration"
            className="max-w-xs"
          />
        </div>

        {/* LOGIN FORM */}
        <div className="p-8 md:p-10">
          {/* Close */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold z-10"
          >
            ✕
          </button>

          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Supplier Login
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm">
            Access your supplier dashboard
          </p>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Supplier Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2
                ${loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-700 hover:bg-emerald-800 active:scale-95"
                }`}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          {/* Default credentials hint */}
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-xs text-emerald-700">
            <p className="font-semibold mb-1">Default Supplier Account:</p>
            <p>Email: <span className="font-mono">supplier@mechpro.com</span></p>
            <p>Password: <span className="font-mono">supplier123</span></p>
          </div>

          {/* Links */}
          <p className="text-center text-sm text-gray-600 mt-4">
            New supplier?{" "}
            <span
              onClick={() => navigate("/supplier-signup")}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Create account
            </span>
          </p>

          <p className="text-center text-sm text-gray-600 mt-3">
            Are you a customer?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Customer Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierLogin;
