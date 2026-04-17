import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("description", product.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await API.post("/tools", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully ✅");
      navigate("/supplier-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error adding product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] p-6 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/supplier-dashboard")}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-800 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <select
            name="category"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Category</option>
            <option value="bike">Bike Parts</option>
            <option value="car">Car Parts</option>
            <option value="engine">Engine Tools</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50">
            <label className="block text-sm font-semibold text-emerald-700 mb-2">
              📷 Upload Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-600 w-full"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 mx-auto object-contain rounded-lg"
              />
            </div>
          )}

          <textarea
            name="description"
            rows="4"
            placeholder="Product Description"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#f6fbf9] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />

          <button
            type="submit"
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
                Uploading...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
