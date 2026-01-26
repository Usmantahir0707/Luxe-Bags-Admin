import { ArrowUp, ArrowDown, ShoppingBag, Package, Users } from "lucide-react";

export default function EcommerceMetrics({ ordersTotal, productsTotal, usersTotal, loading }) {
  // Calculate some meaningful metrics
  const avgOrdersPerUser = usersTotal > 0 ? (ordersTotal / usersTotal).toFixed(1) : '0.0';
  const productsPerCategory = productsTotal > 0 ? Math.ceil(productsTotal / 5) : 0; // Assuming 5 categories
  const orderCompletionRate = ordersTotal > 0 ? '92.5' : '0.0'; // Mock completion rate

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {loading ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : usersTotal.toLocaleString()}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Avg orders per user: {avgOrdersPerUser}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <ArrowUp className="w-3 h-3" />
            15.3%
          </div>
        </div>
      </div>

      {/* Orders Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShoppingBag className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {loading ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : ordersTotal.toLocaleString()}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Completion rate: {orderCompletionRate}%
            </p>
          </div>

          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <ArrowUp className="w-3 h-3" />
            11.0%
          </div>
        </div>
      </div>

      {/* Products Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 sm:col-span-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Package className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Product Catalog
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
              {loading ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : productsTotal.toLocaleString()}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ~{productsPerCategory} products per category • Active listings
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <ArrowUp className="w-3 h-3" />
            9.1%
          </div>
        </div>
      </div>
    </div>
  );
}
