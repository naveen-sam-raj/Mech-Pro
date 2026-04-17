import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const BASE_URL = `http://${window.location.hostname}:5000`;

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("supplierToken");
    if (!token) { navigate("/supplier-login"); return; }

    const fetchProducts = async () => {
      try {
        const res = await API.get("/tools");
        setProducts(res.data);
      } catch {
        navigate("/supplier-login");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/tools/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Unable to delete product ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f5] text-gray-800">

      {/* ── TOPBAR ── */}
      <header className="bg-emerald-800 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-lg">
        <button
          onClick={() => navigate("/supplier-dashboard")}
          className="p-2 rounded-xl hover:bg-emerald-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-tight">My Products</h1>
          <p className="text-emerald-300 text-xs">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => navigate("/addproduct")}
          className="flex items-center gap-1.5 bg-white text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-50 transition active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">

        {/* ── LOADING ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Loading products...</p>
          </div>

        ) : products.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-600">No products yet</h3>
              <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
            </div>
            <button
              onClick={() => navigate("/addproduct")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition active:scale-95"
            >
              + Add Product
            </button>
          </div>

        ) : (
          <>
            {/* ── MOBILE: Card List ── */}
            <div className="md:hidden space-y-3">
              {products.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.image?.startsWith("/uploads") ? `${BASE_URL}${item.image}` : item.image || ""}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/80x80/f0fdf4/16a34a?text=${encodeURIComponent(item.name?.slice(0,2)||"P")}`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5 capitalize">
                        {item.category || "general"}
                      </span>
                      <p className="text-emerald-700 font-extrabold text-lg mt-1">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/editproduct/${item._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <div className="w-px bg-gray-100" />
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── DESKTOP: Table ── */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-emerald-50 text-left text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          <img
                            src={item.image?.startsWith("/uploads") ? `${BASE_URL}${item.image}` : item.image || ""}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/48x48/f0fdf4/16a34a?text=${encodeURIComponent(item.name?.slice(0,2)||"P")}`;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{item.name}</td>
                      <td className="px-5 py-4">
                        <span className="capitalize text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          {item.category || "general"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-emerald-700 text-base">
                        ₹{Number(item.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate(`/editproduct/${item._id}`)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-sm font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-sm font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50 shadow-2xl">
        <button onClick={() => navigate("/supplier-dashboard")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-400 hover:text-emerald-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => navigate("/addproduct")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-400 hover:text-emerald-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-semibold">Add</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-3 gap-1 text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-[10px] font-semibold">Products</span>
        </button>
        <button onClick={() => window.open("/", "_blank")}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-400 hover:text-emerald-600 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-[10px] font-semibold">Store</span>
        </button>
      </nav>

      <div className="md:hidden h-20" />
    </div>
  );
};

export default MyProducts;
