import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoTools } from "react-icons/go";
import API from "./api/axios";

// ── Tracking Steps ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "Ordered",
    label: "Order Placed",
    icon: "🛒",
    desc: "Your order has been received",
  },
  {
    key: "Packed",
    label: "Packed",
    icon: "📦",
    desc: "Order is being packed",
  },
  {
    key: "Shipped",
    label: "Shipped",
    icon: "🚚",
    desc: "Out for delivery",
  },
  {
    key: "Delivered",
    label: "Delivered",
    icon: "✅",
    desc: "Order delivered successfully",
  },
];

// Per-step day offsets from order placed date
const STEP_DAY_OFFSETS = [0, 1, 3, 5];

// ─── Helper: find current step index ──────────────────────────────────────────
const stepIndex = (status) => {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx; // default to 0 (Ordered) if unknown
};

const formatStepDate = (createdAt, dayOffset) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + dayOffset);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Order Tracking Stepper ────────────────────────────────────────────────────
const TrackingStepper = ({ status, createdAt }) => {
  const current = stepIndex(status ?? "Ordered");

  return (
    <div className="relative mt-4 mb-2">
      {/* Progress Line */}
      <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full z-0">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative z-10 flex justify-between items-start">
        {STEPS.map((step, idx) => {
          const isDone = idx < current;
          const isActive = idx === current;
          const isFuture = idx > current;
          const dateLabel = createdAt ? formatStepDate(createdAt, STEP_DAY_OFFSETS[idx]) : "";

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                            border-4 transition-all duration-500
                            ${isDone
                              ? "bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200"
                              : isActive
                              ? "bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200"
                              : "bg-white border-gray-200"
                            }
                            ${isActive ? "scale-110 ring-4 ring-emerald-100" : ""}
                           `}
              >
                {isDone ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <span>{step.icon}</span>
                ) : (
                  <span className="text-gray-300 text-sm">{idx + 1}</span>
                )}
              </div>

              {/* Label + Date */}
              <div className="text-center px-1">
                <p className={`text-xs font-bold ${
                  isDone || isActive ? "text-emerald-700" : "text-gray-400"
                }`}>
                  {step.label}
                </p>

                {/* Per-step date */}
                {isDone ? (
                  <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">✓ {dateLabel}</p>
                ) : isActive ? (
                  <p className="text-[10px] text-orange-500 font-bold mt-0.5">📅 {dateLabel}</p>
                ) : (
                  <p className="text-[10px] text-gray-300 mt-0.5">Est. {dateLabel}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Expected Delivery Date Helper ────────────────────────────────────────────
const getExpectedDelivery = (createdAt, status) => {
  if (status === "Delivered") return null; // Already delivered
  const placed = new Date(createdAt);
  const delivery = new Date(placed);
  delivery.setDate(placed.getDate() + 5);
  return delivery.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ── Order Card ─────────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusColors = {
    Ordered:   "bg-blue-50 text-blue-600 border-blue-200",
    Packed:    "bg-yellow-50 text-yellow-700 border-yellow-200",
    Shipped:   "bg-orange-50 text-orange-600 border-orange-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

      {/* ── Card Header ── */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
        <div>
          <p className="text-xs text-gray-400 font-medium">Order ID</p>
          <p className="text-sm font-bold text-gray-800 font-mono tracking-wide">
            #{String(order._id).slice(-10).toUpperCase()}
          </p>
        </div>

        <div className="hidden sm:block">
          <p className="text-xs text-gray-400 font-medium">Placed On</p>
          <p className="text-sm font-semibold text-gray-700">{placedDate}</p>
        </div>

        {/* Expected Delivery */}
        <div>
          <p className="text-xs text-gray-400 font-medium">Expected Delivery</p>
          {order.status === "Delivered" ? (
            <p className="text-sm font-bold text-emerald-600">✅ Delivered</p>
          ) : (
            <p className="text-sm font-bold text-orange-500">
              📅 {getExpectedDelivery(order.createdAt, order.status)}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium">Total</p>
          <p className="text-sm font-bold text-gray-900">
            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">Status</p>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusColors[order.status] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
            {order.status}
          </span>
        </div>

        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:text-emerald-800 transition-colors"
        >
          {expanded ? "Hide" : "Track Order"}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ── Expanded: Tracking + Items ── */}
      {expanded && (
        <div className="px-6 pb-6 pt-5 space-y-6">

          {/* Tracking Stepper */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-600 rounded-full inline-block" />
              Order Tracking
            </h3>
            <TrackingStepper status={order.status} createdAt={order.createdAt} />
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Address</p>
              <p className="text-sm font-semibold text-gray-800">{order.address.name} · {order.address.phone}</p>
              <p className="text-sm text-gray-500 mt-1">{order.address.address}</p>
            </div>
          )}

          {/* Order Items */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Items ({order.items?.length || 0})
            </p>
            <div className="space-y-2">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image.startsWith("/uploads") ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api','') : `http://${window.location.hostname}:5000`}${item.image}` : item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <span className="text-lg">🔧</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 shrink-0">
                    ₹{(Number(item.price) * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-gray-200">
              <span className="text-sm font-bold text-gray-700">Order Total</span>
              <span className="text-lg font-extrabold text-emerald-700">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>💵</span>
            <span className="font-medium">{order.paymentMethod || "Cash on Delivery"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/my-orders" } });
      return;
    }

    API.get("/orders/my")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f2f7f5]">

      {/* ── Navbar ── */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2 rounded-xl">
              <GoTools size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">MechPro</span>
          </div>

          <div className="h-5 w-px bg-gray-200" />

          <h1 className="text-sm font-bold text-gray-700">My Orders</h1>

          <button
            onClick={() => navigate("/")}
            className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            My <span className="text-emerald-600">Orders</span>
          </h2>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-red-500 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* No Orders */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl">
              🛒
            </div>
            <h3 className="text-xl font-bold text-gray-700">No orders yet!</h3>
            <p className="text-gray-400 text-sm">You haven't placed any orders. Start shopping!</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            <p className="text-sm text-gray-400">{orders.length} order{orders.length > 1 ? "s" : ""} found</p>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
