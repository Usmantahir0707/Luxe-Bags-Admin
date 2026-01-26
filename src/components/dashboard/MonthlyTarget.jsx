import { Target, CheckCircle } from "lucide-react";

export default function MonthlyTarget({ orders, loading }) {
  // Calculate monthly target progress
  const monthlyTarget = 50; // Example target: 50 orders/month
  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === new Date().getMonth() &&
           orderDate.getFullYear() === new Date().getFullYear();
  }).length;

  const progressPercentage = monthlyTarget > 0 ? Math.min((currentMonthOrders / monthlyTarget) * 100, 100) : 0;
  const remainingOrders = Math.max(monthlyTarget - currentMonthOrders, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Target</h3>
        <Target className="text-gray-400" size={20} />
      </div>

      {loading ? (
        <div className="h-48 flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Calculating target progress...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#465FFF"
                strokeWidth="8"
                fill="none"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                {Math.round(progressPercentage)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
            </div>
          </div>

          {/* Target Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
              <span className="font-medium text-gray-800 dark:text-white">{monthlyTarget} orders</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Achieved</span>
              <span className="font-medium text-gray-800 dark:text-white">{currentMonthOrders} orders</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
              <span className="font-medium text-gray-800 dark:text-white">{remainingOrders} orders</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">0</span>
              <span className="text-gray-500 dark:text-gray-400">50%</span>
              <span className="text-gray-500 dark:text-gray-400">100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center justify-center gap-2 py-2 rounded-lg
            ${progressPercentage >= 100 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {progressPercentage >= 100 ? (
              <>
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Target achieved!</span>
              </>
            ) : (
              <>
                <Target size={16} />
                <span className="text-sm font-medium">{remainingOrders} orders to go</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
