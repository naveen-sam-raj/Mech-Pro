import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
    >
      {/* Modern Gradient Background - No Image Needed! */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-5xl px-6">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
          Buy Genuine Mechanic Tools
          <br />
          <span className="text-emerald-400">& Spare Parts</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Quality products for bikes, cars, and workshops
        </p>

        {/* CTA Button */}
        <button className="group bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-2xl transition-all duration-300 hover:shadow-emerald-600/50 hover:-translate-y-1 flex items-center gap-3 mx-auto">
          Shop Now
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { icon: "✅", text: "100% Genuine" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "💯", text: "Best Quality" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
