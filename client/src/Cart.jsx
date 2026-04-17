import React, { useState } from "react";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const gst = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + gst;

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { state: { from: "/checkout" } });
    else navigate("/checkout");
  };

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1f1a] to-[#0a1520] text-gray-200 pb-16 font-sans">

      {/* Blobs */}
      <div className="fixed top-[-120px] right-[-120px] w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 animate-fadeIn">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 transition-all text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-100 to-emerald-400 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            {totalItems > 0 && (
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="w-16 sm:w-24" />
        </div>

        {/* ── Body ── */}
        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-8">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/50"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">

            {/* ── Cart Items ── */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm transition-all duration-300
                    ${removingId === item.id ? "opacity-0 translate-x-8 scale-95" : "opacity-100"}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image?.startsWith("/uploads")
                        ? `http://${window.location.hostname}:5000${item.image}`
                        : item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.target.src = "https://placehold.co/100x100/1a2e28/34d399?text=🔧"; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-100 truncate">{item.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">₹{item.price.toLocaleString("en-IN")} per unit</p>
                    <p className="text-base sm:text-lg font-bold text-emerald-400 mt-1">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>

                    {/* Mobile: qty + remove in row */}
                    <div className="flex items-center gap-3 mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-lg font-bold"
                        >−</button>
                        <span className="w-9 text-center text-sm font-bold text-gray-100">{item.qty}</span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-lg font-bold"
                        >+</button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl hover:bg-red-500/25 hover:border-red-500/50 transition-all"
                        title="Remove item"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
                <h2 className="text-lg font-bold text-gray-100 mb-5">Order Summary</h2>

                <div className="h-px bg-white/[0.08] mb-5" />

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                    <span className="text-gray-200 font-semibold">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (18% GST)</span>
                    <span className="text-gray-200 font-semibold">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 mb-4" />

                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-gray-100">Total</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-dashed border-emerald-500/30 rounded-xl px-4 py-3 text-center mb-5">
                  🎉 You save ₹{Math.round(totalAmount * 0.05).toLocaleString("en-IN")} on this order!
                </div>

                {/* ── CTA Buttons ── */}
                <div className="space-y-3">
                  {/* Proceed to Checkout */}
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-900/50 hover:shadow-emerald-800/60 hover:-translate-y-0.5 active:scale-95 text-sm"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Proceed to Checkout
                  </button>

                  {/* Buy Now (direct checkout) */}
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border-2 border-emerald-500/40 text-emerald-400 font-bold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all active:scale-95 text-sm"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/")}
                    className="w-full py-3 bg-white/[0.04] border border-white/10 text-gray-400 rounded-xl hover:bg-white/[0.08] hover:text-gray-200 hover:border-white/20 transition-all text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex justify-between pt-5 mt-2 border-t border-white/[0.07]">
                  {[
                    { icon: "🔒", label: "Secure" },
                    { icon: "🚚", label: "Free Delivery" },
                    { icon: "↩️", label: "Returns" },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1 text-center flex-1">
                      <span className="text-xl">{b.icon}</span>
                      <span className="text-[10px] text-gray-500 font-medium">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
      `}</style>
    </div>
  );
};

export default Cart;
