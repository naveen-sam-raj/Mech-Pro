import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
      const navigate = useNavigate();
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1">
        <AdminTopbar />

        <div className="p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="text-3xl font-bold mt-2">128</h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">Suppliers</p>
              <h2 className="text-3xl font-bold mt-2">14</h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">Products</p>
              <h2 className="text-3xl font-bold mt-2">320</h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">Revenue</p>
              <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                ₹2.4L
              </h2>
            </div>
          </div>

          {/* INFO */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Welcome, Admin 👋</h3>
            <p className="text-gray-600 text-sm">
              From here you can manage orders, approve suppliers, monitor
              products and control the MechPro platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
