import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api/axios"; // 🔥 axios instance

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 SIGNUP HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/signup", user);

      setSuccess(res.data.message || "Signup successful ✅");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f5] px-4">
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* ================= LEFT IMAGE PANEL ================= */}
        <div className="hidden md:flex items-center justify-center bg-[#e3f1ec] p-8">
          <img
            src="/images/Sign up-bro.png"
            alt="Signup Illustration"
            className="max-w-xm"
          />
        </div>

        {/* ================= SIGNUP FORM ================= */}
        <div className="p-8 md:p-10">
          {/* Close */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Join our mechanic service platform
          </p>

          {/* ❌ Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}

          {/* ✅ Success */}
          {success && (
            <p className="text-green-600 text-sm text-center mt-4">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                required
                className="mt-1 accent-emerald-600"
              />
              <p>
                I agree to the{" "}
                <span className="text-emerald-700 cursor-pointer hover:underline">
                  Terms & Conditions
                </span>
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
