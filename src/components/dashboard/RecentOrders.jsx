import { ShoppingBag, Clock, DollarSign, CreditCard } from "lucide-react";

export default function RecentOrders({ orders, loading }) {
  // Get recent orders (last 5)
  const recentOrders = orders.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
        <ShoppingBag className="text-gray-400" size={20} />
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading recent orders...</p>
          <div className="space-y-2 w-full max-w-md">
            <div className="loading-skeleton h-4 w-full rounded"></div>
            <div className="loading-skeleton h-4 w-3/4 rounded"></div>
            <div className="loading-skeleton h-4 w-1/2 rounded"></div>
          </div>
        </div>
      ) : recentOrders.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No recent orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div key={order._id || index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-b-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">Order #{order._id?.slice(-6) || 'N/A'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Clock size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={14} className="text-green-500" />
                    <span className="font-medium text-gray-800 dark:text-white">
                      PKR {order.totalAmount?.toFixed(0) || '0'}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <CreditCard size={14} className="text-blue-500" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {order.paymentMethod || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {order.items?.length || 0} items
                  </span>
                  <button className="text-xs text-brand-500 hover:text-brand-600 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
