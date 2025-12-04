import React from "react";

export default function OrderStatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-center mr-4 text-xs font-semibold capitalize ${colors[status]}`}>
      {status}
    </span>
  );
}
