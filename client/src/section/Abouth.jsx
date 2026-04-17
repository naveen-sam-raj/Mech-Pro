import React from "react";

const About = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-emerald-600">MechPro Tools</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Story */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                MechPro Tools is your trusted online store for genuine mechanic
                tools and spare parts. We serve bike owners, car enthusiasts,
                and workshops with high-quality, reliable products.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Make buying original tools easy, fast, and affordable for
                everyone. Quality tools shouldn't be hard to find.
              </p>
            </div>
          </div>

          {/* Right - Features */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 shadow-lg border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Us?
            </h3>

            <div className="space-y-6">
              {[
                {
                  icon: "✅",
                  title: "100% Genuine Products",
                  desc: "Only authentic tools and parts",
                },
                {
                  icon: "🔧",
                  title: "Trusted by Mechanics",
                  desc: "Used by professionals nationwide",
                },
                {
                  icon: "🛡️",
                  title: "Secure Shopping",
                  desc: "Safe and encrypted transactions",
                },
                {
                  icon: "⚡",
                  title: "Fast Support",
                  desc: "Quick response to your queries",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "650+", label: "Products" },
            { number: "500+", label: "Happy Customers" },
            { number: "100%", label: "Genuine Parts" },
            { number: "24/7", label: "Support" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
