import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  // Expected delivery = today + 5 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const expectedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f7f5] px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">

        {/* ✅ Animated Circle */}
        <div className="success-circle mx-auto mb-6">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Order Placed Successfully! 🎉
        </h1>

        {orderId && (
          <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded-lg px-3 py-2 mb-3 inline-block">
            Order ID: #{String(orderId).slice(-10).toUpperCase()}
          </p>
        )}

        <p className="text-gray-500 mb-2">
          Cash on Delivery selected.
        </p>

        {/* Expected Delivery Highlight Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">📅 Expected Delivery</p>
          <p className="text-lg font-extrabold text-orange-600">{expectedDelivery}</p>
          <p className="text-xs text-orange-400 mt-1">Estimated 3–5 business days</p>
        </div>

        {/* Tracking Progress Preview */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Order Status</p>
          <div className="flex items-center justify-between gap-2">
            {["🛒 Ordered", "📦 Packed", "🚚 Shipped", "✅ Delivered"].map((step, idx) => (
              <div key={step} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2
                                ${idx === 0
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "bg-white border-gray-200 text-gray-300"
                                }`}>
                  {idx === 0 ? "✓" : idx + 1}
                </div>
                <p className={`text-[9px] font-semibold text-center leading-tight ${idx === 0 ? "text-emerald-600" : "text-gray-300"}`}>
                  {step.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            📦 Track My Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
