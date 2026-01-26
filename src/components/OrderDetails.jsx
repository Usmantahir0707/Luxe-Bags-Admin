import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_URL = "https://luxe-bags-server.onrender.com";

export default function OrderDetails({ order, onClose, onUpdateStatus, token }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [productDetails, setProductDetails] = useState([]);

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

  // Fetch all products from the order
  useEffect(() => {
    async function fetchProducts() {
      const results = [];

      for (const item of order.products) {
        try {
          const res = await fetch(`${API_URL}/api/products/${item.product}`);
          const data = await res.json();
          if (!res.ok) {
            results.push({ ...item, name: item.name || "Unknown product" });
        } else {
            results.push({
              ...item,
              name: data.data.name,
              image: data.data.image || null,
            });
          }
        } catch {
          results.push({
            ...item,
            name: item.name || "Unknown product",
            image: null,
          });
        }
      }

      setProductDetails(results);
    }

    fetchProducts();
  }, [order.products]);

  // Update order status
  const updateStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/orders/${order._id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status : status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update order");
        setLoading(false);
        return;
      }

      onUpdateStatus(order._id, status);
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-white shadow-2xl z-50 
                 border-l flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="p-5 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold">Order Details</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        {/* Order ID */}
        <div>
          <p className="text-gray-400 text-xs">Order ID</p>
          <p className="font-semibold break-all">{order._id}</p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Customer</h3>

          <div className="text-sm">
            <p><span className="font-medium">Name:</span> {order.customerName}</p>
            <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
            <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Shipping Address</h3>
            <div className="text-sm leading-5">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Products</h3>

          {!productDetails.length && (
            <p className="text-gray-500 text-sm">Loading product details...</p>
          )}

          <div className="space-y-3">
            {productDetails.map((p, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg flex items-center gap-3 bg-gray-50"
              >
                {/* Image */}
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center 
                                  justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">{p._id}</p>
                  <p className="text-sm text-gray-600">Qty: {p.quantity}</p>
                </div>

                <p className="font-semibold">PKR {p.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div>
          <p className="text-gray-400 text-xs">Total Amount</p>
          <p className="text-2xl font-bold">PKR {order.totalPrice}</p>
        </div>

        {/* Status Update */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Update Status</h3>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg bg-white"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={updateStatus}
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-semibold
                       bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Save Status"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
