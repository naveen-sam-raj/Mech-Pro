import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ rating = 4.5 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1 font-medium">({rating})</span>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ p, index }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = Math.floor(Math.random() * 15) + 10; // 10–25%
  const originalPrice = Math.round(Number(p.price) * (1 + discount / 100));

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onClick={() => navigate(`/products/${p._id || p.id}`)}
      className="product-card group relative bg-white rounded-2xl overflow-hidden
                 cursor-pointer flex flex-col
                 border border-gray-100
                 shadow-[0_2px_15px_rgba(0,0,0,0.06)]
                 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]
                 hover:-translate-y-1.5
                 transition-all duration-300 ease-out"
      style={{ minHeight: "360px" }}
    >
      {/* ── Top Badges ── */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white tracking-wide shadow-sm">
          NEW
        </span>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white tracking-wide shadow-sm">
          -{discount}%
        </span>
      </div>

      {/* ── Wishlist ── */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setWished((w) => !w);
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow-md
                   flex items-center justify-center
                   hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        <svg
          className={`w-4 h-4 transition-all duration-200 ${
            wished ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-300 hover:stroke-red-400"
          }`}
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* ── Image Zone ── */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-slate-100 overflow-hidden">
        <img
          src={p.image || "/images/placeholder.png"}
          alt={p.name}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x200/f0fdf4/16a34a?text=${encodeURIComponent(p.name?.slice(0, 10) || "Product")}`;
          }}
          className="w-full h-full object-contain p-5
                     group-hover:scale-105 transition-transform duration-400 ease-out"
        />

        {/* hover tint */}
        <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Category */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">
          {p.category || "Mechanic Part"}
        </span>

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200 min-h-[2.5rem]">
          {p.name}
        </h3>

        {/* Stars */}
        <Stars rating={4.5} />

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{Number(p.price).toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-gray-400 line-through font-medium">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
          <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Save {discount}%
          </span>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5">
          <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] text-green-600 font-semibold">In Stock</span>
          <span className="ml-auto text-[11px] text-gray-400">Free Delivery</span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          className={`mt-1 w-full py-2.5 rounded-xl text-sm font-bold
                     flex items-center justify-center gap-2
                     transition-all duration-300 active:scale-95
                     ${
                       added
                         ? "bg-green-500 text-white"
                         : "bg-gray-900 hover:bg-emerald-700 text-white"
                     }`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── View More Card ───────────────────────────────────────────────────────────
const ViewMoreCard = ({ cat, count }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/category/${cat}`)}
      className="view-more-card group cursor-pointer rounded-2xl
                 border-2 border-dashed border-emerald-200
                 hover:border-emerald-500
                 bg-gradient-to-br from-emerald-50 to-teal-50
                 hover:from-emerald-100 hover:to-teal-100
                 hover:shadow-xl hover:-translate-y-1.5
                 transition-all duration-300
                 flex flex-col items-center justify-center
                 text-center p-8 gap-4"
      style={{ minHeight: "380px" }}
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center
                      shadow-lg shadow-emerald-200
                      group-hover:scale-110 group-hover:rotate-6
                      transition-all duration-400">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      <div>
        <p className="font-extrabold text-xl text-gray-800 group-hover:text-emerald-700 transition-colors">
          See All
        </p>
        <p className="text-sm text-gray-500 capitalize mt-1">{cat} Products</p>
      </div>

      <div className="px-5 py-2 rounded-full bg-white border border-emerald-200 text-emerald-700
                      text-xs font-bold shadow-sm
                      group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600
                      transition-all duration-300">
        {count}+ Products Available
      </div>

      <p className="text-xs text-emerald-500 font-semibold opacity-0 group-hover:opacity-100
                    -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        Browse collection →
      </p>
    </div>
  );
};

// ─── Main Section ──────────────────────────────────────────────────────────────
const FeaturedProducts = ({ grouped }) => {

  const hasProducts = grouped && Object.keys(grouped).length > 0;

  return (
    <section className="py-20 bg-[#f7faf9] relative">
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="fp-heading text-center mb-14">
          <p className="text-xs font-bold tracking-[0.25em] text-emerald-600 uppercase mb-3">
            ✦ Top Picks ✦
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Featured{" "}
            <span className="text-emerald-600">Products</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">
            Premium mechanic tools &amp; genuine spare parts — trusted by professionals
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-0.5 w-12 rounded-full bg-emerald-300" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="h-0.5 w-12 rounded-full bg-emerald-300" />
          </div>
        </div>

        {/* ── Products ── */}
        {hasProducts ? (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-16 last:mb-0">
              {/* Category row */}
              <div className="category-header flex items-center gap-3 mb-7">
                <div className="w-1 h-7 rounded-full bg-emerald-600" />
                <h3 className="font-extrabold text-xl text-gray-800 capitalize">{cat}</h3>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  {items.length} items
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {items.slice(0, 3).map((p, i) => (
                  <ProductCard key={p._id || p.id || i} p={p} index={i} />
                ))}
                <ViewMoreCard cat={cat} count={items.length} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Products Yet</h3>
            <p className="text-gray-400 text-sm">Products will appear once added by the supplier.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
