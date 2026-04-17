import React from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const navigate = useNavigate();

  useGSAP(() => {
    gsap.from(".left", {
      x: 200,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".left",
        start: "top 80%",
        end: "bottom 30%",
        scrub: true,
      },
    });
  });

  return (
    <div className="bg-[#f2f7f5] min-h-screen text-gray-800 px-6 py-14">
      <div className="max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate("/")}
            className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
            Back
          </button>

          <h1 className="text-4xl font-bold text-emerald-700 flex-1 text-center">
            About MechProTools
          </h1>

          {/* spacer */}
          <div className="w-24"></div>
        </div>

        {/* ================= INTRO ================= */}
        <div className="mb-14 bg-[#cfe9df] p-8 rounded-2xl shadow-sm ">
          <p className="leading-relaxed text-lg text-gray-700">
            <span className="font-semibold text-gray-900">MechProTools</span> is
            a modern online platform designed to provide genuine mechanic tools
            and automobile spare parts for bikes, cars, and workshops. We aim to
            simplify the process of finding reliable products by bringing
            everything together in one trusted place.
          </p>

          <p className="leading-relaxed text-lg text-gray-700 mt-4">
            Our platform is built with a strong focus on quality, usability, and
            customer trust, making vehicle maintenance easier for both
            professionals and everyday users.
          </p>
        </div>

        {/* ================= VISION & MISSION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#cfe9df] p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              🚀 Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To become a trusted digital marketplace for mechanics, workshops,
              and vehicle owners by offering authentic products, transparent
              pricing, and a smooth online shopping experience.
            </p>
          </div>

          <div className="bg-[#cfe9df] p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">
              🎯 Our Mission
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide 100% genuine tools and spare parts</li>
              <li>Make vehicle maintenance easy and accessible</li>
              <li>Support mechanics and workshops with reliable products</li>
              <li>Save customers time, effort, and cost</li>
            </ul>
          </div>
        </div>

        {/* ================= WHY CHOOSE US ================= */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-emerald-700 mb-10">
            Why Choose MechProTools?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 left">
            {[
              ["🔧", "Genuine Products", "Carefully selected quality tools"],
              ["🛒", "Easy Shopping", "Simple and user-friendly interface"],
              ["⚡", "Time Saving", "Quick access to required spare parts"],
              ["🤝", "Trusted Platform", "Built with customer trust in mind"],
            ].map(([icon, title, desc], index) => (
              <div
                key={index}
                className="bg-[#cfe9df] p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-700 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div className="bg-[#cfe9df] p-8 rounded-2xl text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-2">
            📍 Based In
          </h2>
          <p className="text-gray-700">Thoothukudi, Tamil Nadu</p>
          <p className="text-gray-600 mt-1 text-sm">
            Serving customers with passion, quality, and trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
