import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetails from "./OrderDetails";
import OrderStatusBadge from "./OrderStatusBadge";

export default function Orders({orders, setOrders}) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
 console.log(orders)
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

  return (
    <div className="w-full">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <input
          type="text"
          placeholder="Search by ID or name..."
          className="border px-4 py-2 rounded-lg w-full md:w-72 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <div className="hidden md:grid grid-cols-6 bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700">
          <p>ID</p>
          <p>Customer</p>
          <p>Phone</p>
          <p>Status</p>
          <p>Total</p>
          <p className="text-right">Action</p>
        </div>

        <AnimatePresence>
          {filtered.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-1 md:grid-cols-6 px-6 py-4 border-b text-gray-700"
            >
              <p className="truncate w-[100px]">{o._id}</p>
              <p>{o.customerName}</p>
              <p className="truncate">{o.customerPhone}</p>
              <OrderStatusBadge className='text-center' status={o.status} />
              <p className="font-bold">${o.totalPrice}</p>

              <div className="text-right">
                <button
                  onClick={() => setSelected(o)}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm shadow hover:bg-blue-700"
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

      {/* Order Details Slideover */}
      <AnimatePresence>
        {selected && (
          <OrderDetails
            order={selected}
            onClose={() => setSelected(null)}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
