
import { motion } from "framer-motion";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderDetails({ order, onClose, onUpdateStatus }) {
  if (!order) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-xl z-50 p-6 overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="text-gray-700 mb-4 font-semibold hover:text-gray-900"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-2">Order #{order._id}</h2>
      <OrderStatusBadge status={order.status} />

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Customer</h3>
          <p className="text-gray-600">{order.customerName}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Email</h3>
          <p className="text-gray-600">{order.customeremail}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Address</h3>
          <p className="text-gray-600">{order.address}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Items</h3>
          <ul className="text-gray-700 space-y-2">
            {order.products.map((x, i) => (
              <li key={i} className="flex justify-between">
                <span>{x.product}</span>
                <span>× {x.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Total</h3>
          <p className="text-lg font-bold text-gray-800">${order.total}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Update Status</h3>

          <div className="flex gap-2 flex-wrap">
            {["pending", "shipped", "delivered"].map((status) => (
              <button
                key={status}
                onClick={() => onUpdateStatus(order.id, status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border
                  ${order.status === status ? "bg-blue-600 text-white" : "bg-gray-100"}
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
