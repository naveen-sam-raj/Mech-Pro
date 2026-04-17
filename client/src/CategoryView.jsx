import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import products from "./db"; // ✅ CORRECT PATH

const CARD_BG = "bg-[#cfe9df]";

const CategoryView = () => {
  const { category } = useParams();
  products.filter((p) => p.category === category); // bike / car / engine / accessories
  const navigate = useNavigate();
  const { addToCart } = useCart();
  if (!category) {
    navigate("/categories");
    return null;
  }

  // ✅ FILTER DIRECTLY FROM DB
  const filteredProducts = products.filter((p) => p.category === category);

  const CATEGORY_TITLE = {
    bike: "Bike Parts",
    car: "Car Parts",
    engine: "Engine Tools",
    accessories: "Accessories",
  };

  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-10 text-gray-800">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold flex-1 text-center">
          {CATEGORY_TITLE[category]}
        </h1>

        <div className="w-24"></div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <p className="text-center mt-20 text-gray-600">No products found 😕</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p._id || p.id}`)}
              className={`${CARD_BG} rounded-xl shadow-sm hover:shadow-md transition cursor-pointer hover:-translate-y-1 hover:shadow-emerald-200`}
            >
              <div className="h-44 flex items-center justify-center bg-white rounded-t-xl overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold truncate">{p.name}</h3>
                <p className="text-emerald-700 font-bold mt-1">₹{p.price}</p>

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
