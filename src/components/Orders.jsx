import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetails from "./OrderDetails";
import OrderStatusBadge from "./OrderStatusBadge";

export default function Orders({ orders, setOrders, token, loading = false }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const onUpdateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    );
  };

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
  );

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Orders
          </h1>
          <div className="loading-skeleton h-12 w-full md:w-96 rounded-2xl"></div>
        </div>

        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border">
          <div className="hidden md:grid grid-cols-6 bg-gray-100 px-6 py-4 text-sm font-bold text-gray-800 uppercase tracking-wide">
            <p>ID</p>
            <p>Customer</p>
            <p>Phone</p>
            <p>Status</p>
            <p>Total</p>
            <p className="text-right">Actions</p>
          </div>

          <div className="space-y-4 p-6">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div className="loading-skeleton h-4 w-full rounded"></div>
                <div className="loading-skeleton h-4 w-full rounded"></div>
                <div className="loading-skeleton h-4 w-full rounded"></div>
                <div className="loading-skeleton h-4 w-16 rounded"></div>
                <div className="loading-skeleton h-4 w-12 rounded"></div>
                <div className="loading-skeleton h-10 w-20 rounded-xl ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Orders
        </h1>

        <input
          type="text"
          placeholder="Search by ID, name or phone..."
          className="border px-4 py-3 rounded-2xl w-full md:w-96 shadow-md text-base md:text-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-6 bg-gray-100 px-6 py-4 text-sm font-bold text-gray-800 uppercase tracking-wide">
          <p>ID</p>
          <p>Customer</p>
          <p>Phone</p>
          <p>Status</p>
          <p>Total</p>
          <p className="text-right">Actions</p>
        </div>

        <AnimatePresence>
          {filtered.map((o, i) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.025 }}
              className="grid grid-cols-1 md:grid-cols-6 px-6 py-5 border-b hover:bg-gray-50 transition-all"
            >
              {/* Mobile Layout */}
              <div className="md:hidden mb-3 space-y-2">
                <div>
                  <p className="text-gray-400 text-xs">Order ID</p>
                  <p className="font-semibold truncate">{o._id}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs">Customer</p>
                  <p className="font-semibold">{o.customerName}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="font-semibold">{o.customerPhone}</p>
                </div>
              </div>

              {/* Desktop Layout */}
              <p className="hidden md:block truncate w-[140px]">{o._id}</p>
              <p className="hidden md:block font-medium">{o.customerName}</p>
              <p className="hidden md:block truncate">{o.customerPhone}</p>

              {/* Status */}
              <div className="flex md:block justify-start">
                <OrderStatusBadge status={o.status} />
              </div>

              {/* Total */}
              <p className="font-semibold">PKR {o.totalPrice}</p>

              {/* View Button */}
              <div className="text-right flex md:block justify-end">
                <button
                  onClick={() => setSelected(o)}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white 
                             text-base shadow-md hover:bg-blue-700 active:scale-95 
                             transition font-semibold"
                >
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center py-6 text-gray-500">No orders found</p>
        )}
      </div>

      {/* Slide-over */}
      <AnimatePresence>
        {selected && (
          <OrderDetails
            order={selected}
            onClose={() => setSelected(null)}
            onUpdateStatus={onUpdateStatus}
            token={token}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
