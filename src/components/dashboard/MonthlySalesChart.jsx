import { useEffect, useState } from "react";
import { ShoppingBag, DollarSign } from "lucide-react";

export default function MonthlySalesChart({ orders }) {
  const [chartData, setChartData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('orders'); // 'orders' or 'revenue'

  useEffect(() => {
    try {
      if (orders && Array.isArray(orders) && orders.length > 0) {
        // Process orders by month
        const monthlyOrders = Array(12).fill(0);
        const monthlyRevenue = Array(12).fill(0);
        const currentYear = new Date().getFullYear();

        orders.forEach(order => {
          try {
            if (order.createdAt && order.totalPrice) {
              const orderDate = new Date(order.createdAt);
              if (orderDate.getFullYear() === currentYear) {
                const month = orderDate.getMonth();
                monthlyOrders[month] += 1;
                monthlyRevenue[month] += parseFloat(order.totalPrice) || 0;
              }
            }
          } catch (error) {
            console.error("Error processing order date:", error);
          }
        });

        setChartData(monthlyOrders);
        setRevenueData(monthlyRevenue);
      } else {
        setChartData(Array(12).fill(0));
        setRevenueData(Array(12).fill(0));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in MonthlySalesChart:", error);
      setChartData(Array(12).fill(0));
      setRevenueData(Array(12).fill(0));
      setLoading(false);
    }
  }, [orders]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentData = viewMode === 'orders' ? chartData : revenueData;
  const maxValue = currentData.length > 0 ? Math.max(...currentData) : 10;
  const totalValue = currentData.length > 0 ? currentData.reduce((a, b) => a + b, 0) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Monthly Sales
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {viewMode === 'orders' ? 'Order Count' : 'Revenue'} • Total: {viewMode === 'orders' ? totalValue : formatCurrency(totalValue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('orders')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'orders'
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingBag size={16} />
            Orders
          </button>
          <button
            onClick={() => setViewMode('revenue')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'revenue'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign size={16} />
            Revenue
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading sales data...</p>
        </div>
      ) : (
        <div className="h-64 relative">
          {/* Chart container */}
          <div className="flex h-full items-end gap-4">
            {currentData.map((value, index) => {
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const color = viewMode === 'orders' ? 'bg-brand-500' : 'bg-green-500';
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex-1 flex items-end justify-center">
                    <div
                      className={`${color} w-8 rounded-t-lg transition-all duration-300 hover:opacity-80`}
                      style={{ 
                        height: `${height}%`,
                        minHeight: value > 0 ? '8px' : '0'
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{months[index]}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                    {viewMode === 'orders' ? value : formatCurrency(value)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{viewMode === 'orders' ? maxValue : formatCurrency(maxValue)}</span>
            <span>{viewMode === 'orders' ? Math.round(maxValue * 0.75) : formatCurrency(maxValue * 0.75)}</span>
            <span>{viewMode === 'orders' ? Math.round(maxValue * 0.5) : formatCurrency(maxValue * 0.5)}</span>
            <span>{viewMode === 'orders' ? Math.round(maxValue * 0.25) : formatCurrency(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        </div>
      )}
    </div>
  );
}
