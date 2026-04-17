import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import productsData from "./db";
import API from "./api/axios";

const CARD_BG = "bg-[#cfe9df]";

const CategoryView = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [filteredProducts, setFilteredProducts] = useState([]);

  const CATEGORY_TITLE = {
    bike: "Bike Parts",
    car: "Car Parts",
    engine: "Engine Tools",
    accessories: "Accessories",
  };

  useEffect(() => {
    if (!category) {
      navigate("/categories");
      return;
    }

    // Start with local static products filtered by category
    const localFiltered = productsData.filter((p) => p.category === category);
    setFilteredProducts(localFiltered);

    // Fetch DB products and merge
    API.get("/tools")
      .then((res) => {
        const dbProducts = (res.data || []).map((p) => ({
          ...p,
          image: p.image?.startsWith("/uploads")
            ? `http://${window.location.hostname}:5000${p.image}`
            : p.image,
        }));

        // DB products for this category + local products not in DB
        const dbFiltered = dbProducts.filter((p) => p.category === category);
        const localNotInDB = productsData
          .filter((l) => l.category === category)
          .filter((l) => !dbProducts.find((db) => db.name === l.name));

        setFilteredProducts([...dbFiltered, ...localNotInDB]);
      })
      .catch(() => {
        // Keep local filtered on error
        setFilteredProducts(localFiltered);
      });
  }, [category]);

  if (!category) return null;

  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-10 text-gray-800">
      {/* HEADER */}
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold text-center">
          {CATEGORY_TITLE[category] || category}
        </h1>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <p className="text-center mt-20 text-gray-600">No products found 😕</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p, idx) => (
            <div
              key={p._id || p.id || idx}
              onClick={() => navigate(`/products/${p._id || p.id}`)}
              className={`${CARD_BG} rounded-xl shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 hover:shadow-emerald-200`}
            >
              <div className="h-44 flex items-center justify-center bg-white rounded-t-xl overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full object-contain group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/200x150/f0fdf4/16a34a?text=${encodeURIComponent(p.name?.slice(0, 10) || "Product")}`;
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold truncate">{p.name}</h3>
                <p className="text-emerald-700 font-bold mt-1">₹{Number(p.price).toLocaleString("en-IN")}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    className="flex-1 bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(p); navigate("/checkout"); }}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryView;
