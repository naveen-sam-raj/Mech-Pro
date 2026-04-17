import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "./api/axios"; // axios instance

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 👇 where to go afte  r login
  const from = location.state?.from || "/";

  // 🔥 LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔐 save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ redirect back (checkout / home / whatever)
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f5] px-4">
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* LEFT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-[#e3f1ec] p-8">
          <img
            src="/images/Login-bro.png"
            alt="Login Illustration"
            className="max-w-xm"
          />
        </div>

        {/* LOGIN FORM */}
        <div className="p-8 md:p-10">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Login to your mechanic account
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#f6fbf9]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#f6fbf9]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-2.5 rounded-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              className="text-emerald-700 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </p>
          <p className="text-center text-sm text-gray-600 mt-3">
            Are you a supplier?{" "}
            <span
              onClick={() => navigate("/supplier-login")}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Supplier Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
