// src/pages/KitchenManagerDashboard.jsx
import React from "react";

function KitchenManagerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kitchen Manager Dashboard</h1>
      <p className="text-gray-700">
        Welcome! Here you’ll manage kitchen staff, orders, and meals.
      </p>

      {/* Example sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Pending Orders</h2>
          <p className="text-gray-500">0 new orders</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Assigned Chefs</h2>
          <p className="text-gray-500">No chefs assigned yet</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Menu Items</h2>
          <p className="text-gray-500">No items added yet</p>
        </div>
      </div>
    </div>
  );
}

export default KitchenManagerDashboard;
