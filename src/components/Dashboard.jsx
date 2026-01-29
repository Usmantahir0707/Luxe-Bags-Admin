import { motion } from "framer-motion";
import EcommerceMetrics from "./dashboard/EcommerceMetrics";
import MonthlySalesChart from "./dashboard/MonthlySalesChart";
import StatisticsChart from "./dashboard/StatisticsChart";
import MonthlyTarget from "./dashboard/MonthlyTarget";
import RecentOrders from "./dashboard/RecentOrders";

export default function Dashboard({
  ordersTotal,
  productsTotal,
  usersTotal,
  loading,
  orders = [],
  products = [],
  users = []
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Left Column - Metrics and Sales Chart */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
          ordersTotal={ordersTotal}
          productsTotal={productsTotal}
          usersTotal={usersTotal}
          loading={loading}
        />

        <MonthlySalesChart
          orders={orders}
          loading={loading}
        />
      </div>

      {/* Right Column - Monthly Target */}
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget
          orders={orders}
          loading={loading}
        />
      </div>

      {/* Full Width - Statistics */}
      <div className="col-span-12">
        <StatisticsChart
          orders={orders}
          products={products}
          users={users}
          loading={loading}
        />
      </div>

      {/* Right Column - Recent Orders */}
      <div className="col-span-12 xl:col-span-7">
        <RecentOrders
          orders={orders}
          loading={loading}
        />
      </div>
    </div>
  );
}
