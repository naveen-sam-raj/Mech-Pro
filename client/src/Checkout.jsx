import React, { useState } from "react";
import { useCart } from "./context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "./api/axios";
import emailjs from "@emailjs/browser";

// ── Step Header — defined OUTSIDE Checkout to prevent remount on re-render ────
const StepHeader = ({ step, label, openStep, completedSteps, setOpenStep }) => {
  const isOpen = openStep === step;
  const isDone = completedSteps.includes(step);

  return (
    <div
      onClick={() => (isDone || step === openStep ? setOpenStep(step) : null)}
      className={`flex items-center gap-4 px-6 py-4 border-b cursor-pointer
                  transition-colors duration-200
                  ${isOpen ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                    ${isDone ? "bg-emerald-600 text-white" : isOpen ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"}`}
      >
        {isDone ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : step}
      </div>
      <div className="flex-1">
        <p className={`font-bold text-sm ${isOpen ? "text-gray-900" : "text-gray-500"}`}>{label}</p>
        {isDone && !isOpen && (
          <p className="text-xs text-emerald-600 font-medium mt-0.5">✓ Completed</p>
        )}
      </div>
      <span className={`text-xs font-bold tracking-wide px-3 py-1 rounded-full ${
        isOpen ? "bg-gray-900 text-white" : isDone ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
      }`}>
        {isOpen ? "OPEN" : isDone ? "CHANGE" : "PENDING"}
      </span>
    </div>
  );
};

// ── Input Field — defined OUTSIDE Checkout to prevent keyboard dismiss ─────────
const Field = ({ label, name, type = "text", placeholder, rows, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    {rows ? (
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 bg-gray-50 focus:bg-white
                   px-4 py-3 rounded-xl text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   resize-none placeholder-gray-400 transition-all duration-200"
      />
    ) : (
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 bg-gray-50 focus:bg-white
                   px-4 py-3 rounded-xl text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   placeholder-gray-400 transition-all duration-200"
      />
    )}
  </div>
);

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [openStep, setOpenStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "", email: "", address: "" });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const continueToStep2 = () => {
    if (!user.name || !user.phone || !user.email || !user.address) {
      alert("Please fill all delivery details");
      return;
    }
    setCompletedSteps((prev) => [...new Set([...prev, 1])]);
    setOpenStep(2);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await API.post("/orders", {
        items: cartItems,
        address: { name: user.name, phone: user.phone, email: user.email, address: user.address },
        totalAmount: total,
        paymentMethod: "Cash on Delivery",
      });

      const orderId = res.data.orderId;

      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          { name: user.name, email: user.email, phone: user.phone, address: user.address, total },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (e) {
        console.warn("Email failed (non-critical):", e);
      }

      navigate("/order-success", { state: { orderId } });
    } catch (err) {
      console.error("ORDER FAILED:", err);
      alert("Order placement failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: Steps ─── */}
        <div className="lg:col-span-2 space-y-5">

          {/* STEP 1 — Delivery Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StepHeader step={1} label="Delivery Address" openStep={openStep} completedSteps={completedSteps} setOpenStep={setOpenStep} />

            {openStep === 1 && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" placeholder="e.g. Naveen Kumar" value={user.name} onChange={handleChange} />
                  <Field label="Mobile Number" name="phone" type="tel" placeholder="e.g. 91234 56789" value={user.phone} onChange={handleChange} />
                </div>
                <Field label="Email Address" name="email" type="email" placeholder="e.g. naveen@email.com" value={user.email} onChange={handleChange} />
                <Field label="Full Address" name="address" placeholder="House No., Street, City, Pincode..." rows={3} value={user.address} onChange={handleChange} />

                <button
                  onClick={continueToStep2}
                  className="mt-2 w-full bg-gray-900 hover:bg-emerald-700 text-white
                             py-3.5 rounded-xl font-bold text-sm tracking-wide
                             transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Collapsed preview */}
            {openStep !== 1 && completedSteps.includes(1) && (
              <div className="px-6 py-4 flex items-center justify-between bg-emerald-50/50">
                <div>
                  <p className="text-sm font-bold text-gray-800">{user.name} · {user.phone}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{user.address}</p>
                </div>
                <button onClick={() => setOpenStep(1)} className="text-xs text-emerald-600 font-bold hover:underline">
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* STEP 2 — Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StepHeader step={2} label="Payment Method" openStep={openStep} completedSteps={completedSteps} setOpenStep={setOpenStep} />

            {openStep === 2 && (
              <div className="p-6 space-y-4">
                {/* COD Option */}
                <label className="flex items-center gap-4 p-4 border-2 border-emerald-500 bg-emerald-50/40 rounded-xl cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives at your door</p>
                  </div>
                  <div className="text-2xl">💵</div>
                </label>

                {/* Disabled UPI */}
                <label className="flex items-center gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl opacity-50 cursor-not-allowed">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-500 text-sm">UPI / Online Payment</p>
                    <p className="text-xs text-gray-400 mt-0.5">Coming soon</p>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-500 font-semibold px-2 py-0.5 rounded-full">Soon</span>
                </label>

                {/* Trust badges */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                  {["🔒 Secure", "🚚 Free Delivery", "↩️ Easy Returns"].map((badge) => (
                    <span key={badge} className="text-xs text-gray-500 font-medium">{badge}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-extrabold text-gray-900">Order Summary</h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                {cartItems.reduce((s, i) => s + i.qty, 0)} items
              </span>
            </div>

            {/* Items */}
            <div className="px-6 py-4 space-y-3 max-h-64 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => (e.target.style.display = "none")}
                        className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Price Breakdown */}
            <div className="px-6 py-4 border-t border-gray-50 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-700">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Payment Mode</span>
                <span className="font-semibold text-gray-700">Cash on Delivery</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Place Order */}
            <div className="px-6 pb-6">
              <button
                onClick={placeOrder}
                disabled={placing || cartItems.length === 0 || openStep < 2}
                className={`w-full py-4 rounded-xl font-extrabold text-sm tracking-wide
                           flex items-center justify-center gap-2
                           transition-all duration-300 active:scale-95
                           ${placing || cartItems.length === 0 || openStep < 2
                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                             : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl"
                           }`}
              >
                {placing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Place Order
                  </>
                )}
              </button>

              {openStep < 2 && (
                <p className="text-center text-xs text-gray-400 mt-2">Complete the steps above to place your order</p>
              )}

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                100% Secure & Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
