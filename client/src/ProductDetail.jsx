import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import API from "./api/axios";
import productsData from "./db";

// ─── Star Rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        className={`w-5 h-5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-sm text-gray-500 ml-2 font-medium">{rating} / 5.0</span>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Load product — try db.js first, then MongoDB API
  useEffect(() => {
    const found = productsData.find(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );

    if (found) {
      setProduct(found);
      setLoading(false);
    } else {
      // Try MongoDB (supplier products)
      API.get(`/tools/${id}`)
        .then((res) => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const discount = product
    ? Math.floor(Math.random() * 15) + 10
    : 0;
  const originalPrice = product
    ? Math.round(Number(product.price) * (1 + discount / 100))
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate("/checkout");
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f7f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f2f7f5] flex flex-col items-center justify-center gap-5">
        <div className="text-6xl">🔧</div>
        <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
        <p className="text-gray-400">This product doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const imageSrc = product.image
    ? product.image.startsWith("/uploads")
      ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api','') : `http://${window.location.hostname}:5000`}${product.image}`
      : product.image
    : `https://placehold.co/500x400/f0fdf4/16a34a?text=${encodeURIComponent(product.name?.slice(0, 12) || "Product")}`;

  return (
    <div className="min-h-screen bg-[#f2f7f5]">
      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Image ── */}
          <div className="lg:sticky lg:top-24 relative z-0">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
              {/* Discount badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  -{discount}% OFF
                </span>
              </div>

              <img
                src={imageSrc}
                alt={product.name}
                onError={(e) => {
                  e.target.src = `https://placehold.co/500x400/f0fdf4/16a34a?text=${encodeURIComponent(product.name?.slice(0, 12) || "Product")}`;
                }}
                className="w-full max-h-80 object-contain mx-auto group-hover:scale-105 transition-transform duration-500"
              />

              {/* Trustbadges under image */}
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-50 pt-5">
                {[
                  { icon: "🚚", label: "Free Delivery" },
                  { icon: "↩️", label: "Easy Returns" },
                  { icon: "🔒", label: "Secure Pay" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[11px] text-gray-500 font-medium text-center">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col gap-6">
            {/* Category Tag */}
            <span className="inline-block w-fit text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full capitalize">
              {product.category || "Mechanic Part"}
            </span>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <Stars rating={4.5} />
              <span className="text-sm text-gray-400">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-gray-900">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="text-xl text-gray-400 line-through font-medium">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="ml-auto text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Inclusive of all taxes • Free shipping</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-emerald-600 rounded-full inline-block"></span>
                Product Description
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description ||
                  `Premium quality ${product.name} designed for professional mechanics and DIY enthusiasts. 
                   Built to last with high-grade materials, ensuring superior performance and durability. 
                   Compatible with most vehicle models. Backed by warranty and quality assurance.`}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-600">In Stock</span>
              <span className="text-sm text-gray-400 ml-2">— Ready to ship within 24 hours</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-400">
                Total: <span className="font-bold text-gray-700">₹{(Number(product.price) * qty).toLocaleString("en-IN")}</span>
              </span>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3
                           transition-all duration-300 active:scale-95 shadow-sm
                           ${added
                             ? "bg-green-500 text-white shadow-green-200 shadow-lg"
                             : "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                           }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3
                           bg-emerald-600 text-white
                           hover:bg-emerald-700
                           shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40
                           hover:-translate-y-0.5
                           transition-all duration-300 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Extra info */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-sm text-emerald-700 flex items-start gap-3">
              <span className="text-lg">ℹ️</span>
              <p>
                <span className="font-bold">Secure Checkout:</span> Your payment and personal information is always protected.
                Cash on Delivery available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
