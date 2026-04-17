import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HOME_CATEGORIES = [
  {
    key: "bike",
    title: "Bike Parts",
    icon: "🏍️",
    gradient: "from-blue-500 to-blue-600",
    count: "150+",
    description: "Premium quality components",
  },
  {
    key: "car",
    title: "Car Parts",
    icon: "🚗",
    gradient: "from-purple-500 to-purple-600",
    count: "200+",
    description: "Certified automotive parts",
  },
  {
    key: "engine",
    title: "Engine Tools",
    icon: "⚙️",
    gradient: "from-orange-500 to-orange-600",
    count: "120+",
    description: "Professional grade tools",
  },
  {
    key: "accessories",
    title: "Accessories",
    icon: "🔧",
    gradient: "from-emerald-500 to-emerald-600",
    count: "180+",
    description: "Workshop essentials",
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
      });
    });
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our premium collection of automotive parts and tools
          </p>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOME_CATEGORIES.map((cat, index) => (
            <div
              key={cat.key}
              ref={(el) => (cardsRef.current[index] = el)}
              onClick={() => navigate(`/category/${cat.key}`)}
              className="group cursor-pointer bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>

              {/* Title */}
              <h3
                className={`text-2xl font-bold mb-2 bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}
              >
                {cat.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{cat.description}</p>

              {/* Count Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  {cat.count} Items
                </span>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
