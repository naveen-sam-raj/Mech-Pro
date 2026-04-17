import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios"; // 🔥 axios instance (token auto send)

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // product id from URL

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // 🔥 1) LOAD PRODUCT FROM BACKEND
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/tools/${id}`);
        setProduct(res.data);
        setImagePreview(res.data.image || null);
      } catch (err) {
        setError("Unable to load product ❌");
      }
    };

    fetchProduct();
  }, [id]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  // Image change handler (preview only – upload later)
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 🔥 2) UPDATE PRODUCT (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("description", product.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await API.put(`/tools/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully ✅");
      navigate("/MyProducts");
    } catch (err) {
      setError("Update failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] p-8 text-gray-800">
      <div className="max-w-3xl mx-auto bg-[#cfe9df] rounded-2xl shadow-sm p-8">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/myproducts")}
            className="bg-emerald-700 text-white px-6 py-2 rounded-lg"
          >
            Back
          </button>
          <h1 className="text-2xl flex-1 text-center font-semibold">
            Edit Product
          </h1>
        </div>

        {/* ❌ Error */}
        {error && (
          <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
        )}

        {/* ================= FORM ================= */}
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Product Name */}
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required
          />

          {/* Category */}
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="bike">Bike Parts</option>
            <option value="car">Car Parts</option>
            <option value="engine">Engine Tools</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Change Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="bg-white p-4 rounded-xl">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 mx-auto object-contain"
              />
            </div>
          )}

          {/* Description */}
          <textarea
            name="description"
            rows="4"
            value={product.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full px-4 py-2 rounded-lg bg-[#f6fbf9] focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
          />

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-700 text-white py-3 rounded-lg hover:bg-emerald-800 transition"
            >
              Update Product
            </button>

            <button
              type="button"
              onClick={() => navigate("/myproducts")}
              className="flex-1 bg-white py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
