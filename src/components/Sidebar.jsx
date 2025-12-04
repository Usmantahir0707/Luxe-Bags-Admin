import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
} from "lucide-react";

export default function Sidebar({ active, setActive }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col w-64 bg-white shadow-xl border-r"
      >
        <div className="p-6 text-2xl font-bold tracking-wide text-gray-800 border-b">
          Luxe Bags
        </div>

        <div className="flex flex-col p-4 gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all
                ${
                  active === t.id
                    ? "bg-black text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              {t.icon}
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* MOBILE BOTTOM NAV */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t flex justify-around py-2 z-50"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex flex-col items-center text-xs ${
              active === t.id ? "text-black font-semibold" : "text-gray-500"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </motion.div>
    </>
  );
}
