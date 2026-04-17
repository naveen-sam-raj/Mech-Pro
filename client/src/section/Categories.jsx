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
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "car",
    title: "Car Parts",
    icon: "🚗",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    key: "engine",
    title: "Engine Tools",
    icon: "⚙️",
    gradient: "from-orange-500 to-red-500",
  },
  {
    key: "accessories",
    title: "Accessories",
    icon: "🔧",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const Categories = ({ grouped }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        y: -40,
        scale: 0.9,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 105%",
          once: true,
        },
      });

      // Cards stagger animation
      gsap.from(cardsRef.current, {
        y: 60,
        scale: 0.85,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 105%",
          once: true,
        },
      });

      // Continuous float animation
      cardsRef.current.forEach((card, index) => {
        gsap.to(card, {
          y: -12,
          duration: 2 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.15,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (index, isHovering) => {
    const card = cardsRef.current[index];
    const icon = card?.querySelector(".category-icon");
    const bg = card?.querySelector(".gradient-bg");

    if (isHovering) {
      gsap.to(card, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(icon, {
        scale: 1.3,
        rotation: 360,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(bg, {
        opacity: 1,
        scale: 1.1,
        duration: 0.4,
      });
    } else {
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
      });

      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
      });

      gsap.to(bg, {
        opacity: 0.8,
        scale: 1,
        duration: 0.3,
      });
    }
  };

  const handleCardClick = (categoryKey, index) => {
    const card = cardsRef.current[index];

    gsap.to(card, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        navigate(`/category/${categoryKey}`);
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Shop by Category
        </h2>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {HOME_CATEGORIES.map((cat, index) => (
            <div
              key={cat.key}
              ref={(el) => (cardsRef.current[index] = el)}
              onClick={() => handleCardClick(cat.key, index)}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              className="cursor-pointer relative group"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 text-center shadow-md overflow-hidden border-2 border-gray-100">
                {/* Gradient Background */}
                <div
                  className={`gradient-bg absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                ></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="category-icon text-5xl mb-4 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3
                    className={`font-semibold text-xl bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}
                  >
                    {cat.title}
                  </h3>

                  {/* Arrow on Hover */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <svg
                      className="w-6 h-6 mx-auto text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${cat.gradient} blur-xl -z-10`}
                ></div>
              </div>

              {/* Shadow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/10 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
