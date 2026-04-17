import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [supplierName, setSupplierName] = useState("Supplier");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    if (!token) { navigate("/supplier-login"); return; }

    // Decode name from JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.name) setSupplierName(payload.name);
    } catch (_) {}

    const fetchProducts = async () => {
      try {
        const res = await API.get("/tools");
        setTotalProducts(res.data.length);
      } catch {
        localStorage.removeItem("supplierToken");
        navigate("/supplier-login");
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("supplierToken");
    navigate("/supplier-login");
  };

  const navItems = [
    {
      label: "Add Product",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      action: () => navigate("/addproduct"),
    },
    {
      label: "My Products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      action: () => navigate("/myproducts"),
    },
    {
      label: "Visit Store",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      ),
      action: () => window.open("/", "_blank"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f5] text-gray-800">

      {/* ── TOPBAR ── */}
      <header className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-emerald-700 transition"
            onClick={() => setMobileMenuOpen(o => !o)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">Supplier Panel</h1>
            <p className="text-emerald-300 text-xs hidden sm:block">MechPro Dashboard</p>
          </div>
        </div>

        {/* Desktop Nav in Topbar */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: User + Logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-700/60 px-3 py-1.5 rounded-lg">
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
              {supplierName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold">{supplierName.split(" ")[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white rounded-lg transition text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── MOBILE SLIDE MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 text-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.action(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-emerald-700 transition text-sm font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl p-5 mb-6 text-white flex items-center justify-between">
          <div>
            <p className="text-emerald-200 text-sm mb-1">Welcome back 👋</p>
            <h2 className="text-xl font-bold">{supplierName}</h2>
            <p className="text-emerald-200 text-xs mt-1">Manage your products from here</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            🔧
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Products</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Orders</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-2">0</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-lg font-bold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate("/addproduct")}
            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-4 rounded-2xl font-semibold shadow-md shadow-emerald-600/30 transition-all"
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => navigate("/myproducts")}
            className="flex items-center gap-3 bg-white hover:bg-gray-50 active:scale-95 text-gray-800 px-5 py-4 rounded-2xl font-semibold shadow-sm border border-gray-200 transition-all"
          >
            <svg className="w-6 h-6 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>My Products</span>
          </button>

          <button
            onClick={() => window.open("/", "_blank")}
            className="flex items-center gap-3 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 px-5 py-4 rounded-2xl font-semibold shadow-sm border-2 border-emerald-200 transition-all"
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Visit Store →</span>
          </button>
        </div>

        {/* ── INFO ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-600 rounded-full inline-block" />
            Getting Started
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Add your products with images, set prices and categories — they'll appear live on the customer store instantly.
            Tap <strong className="text-emerald-600">"Add New Product"</strong> to get started.
          </p>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 shadow-2xl">
        <button
          onClick={() => navigate("/supplier-dashboard")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-emerald-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <span className="text-[10px] font-semibold">Dashboard</span>
        </button>
        <button
          onClick={() => navigate("/addproduct")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-500 hover:text-emerald-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-semibold">Add</span>
        </button>
        <button
          onClick={() => navigate("/myproducts")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-500 hover:text-emerald-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[10px] font-semibold">Products</span>
        </button>
        <button
          onClick={() => window.open("/", "_blank")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-500 hover:text-emerald-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-[10px] font-semibold">Store</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-red-400 hover:text-red-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-20" />
    </div>
  );
};

export default SupplierDashboard;
