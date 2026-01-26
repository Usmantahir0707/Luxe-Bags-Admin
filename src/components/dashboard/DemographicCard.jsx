import { Users, MapPin, Globe, BarChart2 } from "lucide-react";

export default function DemographicCard({ users, loading }) {
  // Calculate user demographics
  const totalUsers = users.length;

  // Mock demographic data (in a real app, this would come from user profiles)
  const demographics = [
    {
      title: "Top Location",
      value: "New York, USA",
      icon: <MapPin className="text-blue-500" size={20} />,
      percentage: 35
    },
    {
      title: "Age Group",
      value: "25-34 years",
      icon: <Users className="text-green-500" size={20} />,
      percentage: 42
    },
    {
      title: "Device Type",
      value: "Mobile (68%)",
      icon: <Globe className="text-purple-500" size={20} />,
      percentage: 68
    },
    {
      title: "New Customers",
      value: `${Math.round(totalUsers * 0.25)} this month`,
      icon: <BarChart2 className="text-orange-500" size={20} />,
      percentage: 25
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Demographics</h3>
        <Users className="text-gray-400" size={20} />
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Analyzing customer data...</p>
          <div className="space-y-3 w-full max-w-sm">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="loading-skeleton h-8 w-8 rounded-lg"></div>
                  <div className="space-y-1">
                    <div className="loading-skeleton h-3 w-20 rounded"></div>
                    <div className="loading-skeleton h-3 w-16 rounded"></div>
                  </div>
                </div>
                <div className="loading-skeleton h-3 w-12 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {demographics.map((demo, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  {demo.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{demo.title}</div>
                  <div className="font-medium text-gray-800 dark:text-white">{demo.value}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{demo.percentage}%</div>
                <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-brand-500 rounded-full"
                    style={{ width: `${demo.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* User Growth Chart */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-sm font-medium text-gray-800 dark:text-white mb-2">User Growth</div>
            <div className="flex items-end gap-1 h-20">
              {[20, 25, 30, 35, 40, 45, 50, 45, 40, 35, 30, 25].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand-100 rounded-t-sm"
                    style={{ height: `${value}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
