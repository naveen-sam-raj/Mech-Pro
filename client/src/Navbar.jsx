import React, { useState, useEffect, useRef } from "react";
import { GoTools } from "react-icons/go";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import API from "./api/axios";
import productsData from "./db";

const Navbar = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔍 Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);

  // 🔐 login check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsLoggedIn(!!token);
    if (user?.name) setUserName(user.name);
  }, []);

  // 🚪 logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  // 📦 Load ALL products for search (db.js base + DB supplier products)
  useEffect(() => {
    // Immediately set static local products — no localStorage timing issue
    setAllProducts(productsData);

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

  // 🔍 Search filter logic
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
    setSearchResults(filtered.slice(0, 8));
    setShowDropdown(true);
  }, [searchQuery, allProducts]);

  // 🖱️ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (product) => {
    const productId = product._id || product.id;
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/products/${productId}`);
  };

  const handleQuickAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 p-2.5 md:p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <GoTools size={20} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MechPro
              </h1>
              <p className="text-xs text-emerald-600 font-semibold -mt-1 hidden sm:block">
                Professional Tools
              </p>
            </div>
          </div>

          {/* 🔍 Search Bar — Desktop only */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-64 focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
              <FiSearch className="text-gray-400 shrink-0" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {searchQuery && (
                <button onClick={clearSearch}>
                  <FiX className="text-gray-400 hover:text-gray-600" size={14} />
                </button>
              )}
            </div>
            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-5 py-6 text-center">
                    <p className="text-gray-400 text-sm">No products found for <span className="font-semibold text-gray-600">"{searchQuery}"</span></p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/80">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{searchResults.length} result{searchResults.length > 1 ? "s" : ""} found</p>
                    </div>
                    <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {searchResults.map((product, idx) => (
                        <li key={product._id || product.id || idx}
                          onClick={() => handleSearchSelect(product)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                            {product.image ? (
                              <img
                                src={product.image.startsWith("/uploads") ? `http://${window.location.hostname}:5000${product.image}` : product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => e.target.style.display = "none"}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🔧</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-700">{product.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{product.category || "General"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {product.price && (
                              <span className="text-sm font-bold text-emerald-600">₹{Number(product.price).toLocaleString("en-IN")}</span>
                            )}
                            <button
                              onClick={(e) => handleQuickAddToCart(e, product)}
                              className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full hover:bg-emerald-700 transition-colors"
                            >
                              + Cart
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
                      <p className="text-xs text-gray-400 text-center">Click <span className="font-semibold text-emerald-600">any product</span> to view details</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { name: "Home", path: "/" },
              { name: "Categories", path: "/categories" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Cart", path: "/cart" },
              { name: "My Orders", path: "/my-orders" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="px-5 py-2.5 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 font-medium transition-all duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-emerald-600 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/login")}
                className="relative px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl opacity-0 hover:opacity-100 transition-opacity"></div>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-emerald-800 font-semibold text-sm">Hi, {userName.split(" ")[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-white text-red-500 font-semibold rounded-xl border-2 border-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ☰ Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* 📱 Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 animate-fadeIn">

            {/* Mobile Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3">
              <FiSearch className="text-gray-400 shrink-0" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
              {searchQuery && (
                <button onClick={clearSearch}>
                  <FiX className="text-gray-400" size={14} />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-lg mb-2 overflow-hidden">
                <ul className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                  {searchResults.map((product, idx) => (
                    <li
                      key={product._id || product.id || idx}
                      onClick={() => { handleSearchSelect(product); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      {product.price && <span className="text-sm font-bold text-emerald-600">₹{Number(product.price).toLocaleString("en-IN")}</span>}
                      <button
                        onClick={(e) => { handleQuickAddToCart(e, product); setMobileMenuOpen(false); }}
                        className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-1 rounded-full"
                      >+ Cart</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nav Links */}
            {[
              { name: "🏠 Home", path: "/" },
              { name: "📦 Categories", path: "/categories" },
              { name: "🛒 Cart", path: "/cart" },
              { name: "📋 My Orders", path: "/my-orders" },
              { name: "ℹ️ About", path: "/about" },
              { name: "📞 Contact", path: "/contact" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium transition-all text-sm"
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-gray-100 mt-2">
              {!isLoggedIn ? (
                <button
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Login
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold shadow">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{userName}</p>
                      <p className="text-xs text-emerald-600">Logged in</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-3 bg-white text-red-500 font-bold rounded-xl border-2 border-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
