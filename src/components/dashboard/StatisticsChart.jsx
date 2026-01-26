import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, UserCheck } from "lucide-react";

export default function StatisticsChart({ orders, products, users, loading }) {
  // Calculate statistics with error handling
  let totalRevenue = 0;
  let averageOrderValue = 0;
  let conversionRate = 0;

  try {
    if (Array.isArray(orders)) {
      totalRevenue = orders.reduce((sum, order) => {
        const amount = order.totalPrice || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

      averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    }

    if (Array.isArray(products) && products.length > 0) {
      conversionRate = (orders.length / products.length) * 100;
    }
  } catch (error) {
    console.error("Error calculating statistics:", error);
  }

  const stats = [
    {
      title: "Total Revenue",
      value: loading ? "Loading..." : `PKR ${totalRevenue.toFixed(0)}`,
      icon: <DollarSign className="text-green-500" size={24} />,
      change: 12.5,
      trend: "up"
    },
    {
      title: "Avg. Order Value",
      value: loading ? "Loading..." : `PKR ${averageOrderValue.toFixed(0)}`,
      icon: <ShoppingCart className="text-blue-500" size={24} />,
      change: 8.3,
      trend: "down"
    },
    {
      title: "Conversion Rate",
      value: loading ? "Loading..." : `${conversionRate.toFixed(1)}%`,
      icon: <UserCheck className="text-purple-500" size={24} />,
      change: 15.7,
      trend: "up"
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Key Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-3">
              {stat.icon}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {loading ? (
                <div className="loading-skeleton h-6 w-24 rounded"></div>
              ) : stat.value}
            </div>
            <div className={`flex items-center justify-center gap-1 text-xs font-medium
              ${stat.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}
              px-2 py-1 rounded-full`}>
              {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {stat.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
