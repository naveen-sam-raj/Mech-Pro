import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // frontend demo only
    console.log("Contact Form Data:", form);

    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-14 text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
             Back
          </button>

          <h1 className="text-3xl font-bold text-emerald-700 flex-1 text-center">
            Contact Us
          </h1>

          {/* empty div for alignment */}
          <div className="w-24"></div>
        </div>

        {/* ================= FORM CARD ================= */}
        <div className="bg-[#cfe9df] rounded-2xl shadow-md p-8 max-w-xl mx-auto">
          <p className="text-gray-700 mb-8 text-center">
            Have a question or need help? Fill out the form below and we’ll get
            back to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="block mb-1 text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-1 text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              ></textarea>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 transition py-2.5 rounded-lg font-semibold text-white"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
