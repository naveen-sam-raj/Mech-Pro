import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import productsData from "./db";
import API from "./api/axios";

const CARD_BG = "bg-[#cfe9df]";

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState(productsData);

  const categories = [
    { key: "bike", title: "Bike Parts" },
    { key: "car", title: "Car Parts" },
    { key: "engine", title: "Engine Tools" },
    { key: "accessories", title: "Accessories" },
  ];

  useEffect(() => {
    // Start with local products immediately
    setAllProducts(productsData);

    // Merge with DB supplier products
    API.get("/tools")
      .then((res) => {
        const dbProducts = (res.data || []).map((p) => ({
          ...p,
          image: p.image?.startsWith("/uploads")
            ? `http://${window.location.hostname}:5000${p.image}`
            : p.image,
        }));
        const merged = [
          ...dbProducts,
          ...productsData.filter((l) => !dbProducts.find((db) => db.name === l.name)),
        ];
        setAllProducts(merged);
      })
      .catch(() => {
        setAllProducts(productsData);
      });
  }, []);

  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-3xl font-bold">All Products</h1>
      </div>

      {categories.map((cat) => {
        const filtered = allProducts.filter((p) => p.category === cat.key);
        if (filtered.length === 0) return null;

        return (
          <div key={cat.key} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{cat.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p, idx) => (
                <div
                  key={p._id || p.id || idx}
                  onClick={() => navigate(`/products/${p._id || p.id}`)}
                  className={`${CARD_BG} rounded-xl shadow cursor-pointer hover:shadow-md hover:-translate-y-1 transition`}
                >
                  <div className="h-44 bg-white flex items-center justify-center rounded-t-xl overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full object-contain"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/200x150/f0fdf4/16a34a?text=${encodeURIComponent(p.name?.slice(0, 10) || "Product")}`;
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <p className="text-emerald-700 font-bold">₹{Number(p.price).toLocaleString("en-IN")}</p>

                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="mt-4 w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProducts;
