import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import API from "./api/axios";
import FeaturedProducts from "./section/FeaturedProducts";
import WhyChooseUs from "./section/WhyChooseUs";
import Hero from "./section/Hero";
import Categories from "./Categories";
import Abouth from "./section/Abouth";
import Contacth from "./section/Contacth";
import productsData from "./db";

const CARD_BG = "bg-[#cfe9df]";

const HOME_CATEGORIES = [
  { title: "Bike Parts", key: "bike" },
  { title: "Car Parts", key: "car" },
  { title: "Engine Tools", key: "engine" },
  { title: "Accessories", key: "accessories" },
];

// Build grouped object OUTSIDE component so it never changes reference
const buildGrouped = (list) => {
  const group = {};
  list.forEach((p) => {
    const cat = (p.category && p.category !== "other") ? p.category : "general";
    if (!group[cat]) group[cat] = [];
    group[cat].push(p);
  });
  return group;
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // ✅ Initialize DIRECTLY from productsData — products visible on very first render
  const [grouped, setGrouped] = useState(() => buildGrouped(productsData));
  const [allProducts, setAllProducts] = useState(productsData);

  // 📦 Merge with MongoDB supplier products when API responds
  useEffect(() => {
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
          ...productsData.filter(
            (l) => !dbProducts.find((db) => db.name === l.name)
          ),
        ];
        setAllProducts(merged);
        setGrouped(buildGrouped(merged));
      })
      .catch(() => {
        // API offline — local productsData already shown, nothing extra needed
      });
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= CATEGORIES ================= */}
      <Categories grouped={grouped} />

      {/* ================= FEATURED PRODUCTS ================= */}
      <FeaturedProducts grouped={grouped} />

      {/* ================= WHY CHOOSE ================= */}
      <WhyChooseUs />

     <Abouth />
     <Contacth />

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0f172a] text-gray-400 pt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Mech<span className="text-emerald-500">Pro</span>Tools
            </h2>
            <p className="text-sm">
              Genuine mechanic tools & spare parts you can trust.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer">Home</li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Categories
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">About</li>
              <li className="hover:text-emerald-400 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer">
                Bike Parts
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Car Parts
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Engine Tools
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                Accessories
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-sm">📍 Thoothukudi, Tamil Nadu</p>
            <p className="text-sm">📞 +91 90000 00000</p>
            <p className="text-sm">✉️ support@mechprotools.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 py-4 text-center text-sm">
          © {new Date().getFullYear()} MechProTools. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
