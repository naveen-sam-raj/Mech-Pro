import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

const CARD_BG = "bg-[#cfe9df]"; // same thick green card bg

const ProductsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(all.filter((p) => p.category === category));
  }, [category]);

  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-10 text-gray-800">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize">{category} Products</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-800 transition"
        >
          ← Back
        </button>
      </div>

      {/* ================= PRODUCTS ================= */}
      {products.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          No products found 😕
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className={`${CARD_BG} rounded-xl shadow-sm hover:shadow-md transition`}
            >
              {/* IMAGE */}
              <div className="h-44 flex items-center justify-center bg-white rounded-t-xl">
                <img
                  src={p.image || "/images/no-image.png"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/no-image.png";
                  }}
                  alt={p.name}
                  className="h-full object-contain"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4">
                <h3 className="font-semibold truncate">{p.name}</h3>
                <p className="text-emerald-700 font-bold mt-1">₹{p.price}</p>

                <button
                  onClick={() => addToCart(p)}
                  className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
