import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Sidebar({ active, setActive }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Calculate submenu height when opened
  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight(prev => ({
        ...prev,
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0
      }));
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu(prev => prev === index ? null : index);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col bg-gray-300 shadow-xl border-r border-gray-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300"
        style={{
          width: isExpanded || isHovered ? '290px' : '90px'
        }}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LOGO/BRAND */}
        <div className="py-8 px-5 flex justify-start border-b border-gray-200">
          {(isExpanded || isHovered) ? (
            <div className="text-2xl font-bold tracking-wide text-gray-800">
              Luxe Bags
            </div>
          ) : (
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
          )}
        </div>

        {/* MAIN NAVIGATION */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
          <nav className="mb-6 px-3">
            <div className="flex flex-col gap-2">
              {/* Menu Section */}
              <div className="mb-4">
                {(isExpanded || isHovered) && (
                  <h2 className="mb-4 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                    Menu
                  </h2>
                )}
                <ul className="flex flex-col gap-1">
                  {tabs.map((tab, index) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActive(tab.id)}
                        className={`relative flex items-center w-full gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-all group
                          ${active === tab.id
                            ? 'bg-brand-50 text-brand-500 border border-brand-100'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        <span className={`text-lg ${active === tab.id ? 'text-brand-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
                          {tab.icon}
                        </span>
                        {(isExpanded || isHovered) && (
                          <>
                            <span className="flex-1 text-left">{tab.label}</span>
                            {tab.subItems && (
                              <ChevronDown
                                className={`ml-auto w-4 h-4 transition-transform duration-200
                                  ${openSubmenu === index ? 'rotate-180 text-brand-500' : ''}`}
                              />
                            )}
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* EXPAND/COLLAPSE TOGGLE */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {(isExpanded || isHovered) ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* MOBILE BOTTOM NAV */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 flex justify-around py-2 z-50"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex flex-col items-center text-xs px-3 py-2 rounded transition-all
              ${active === t.id
                ? 'text-brand-500 font-semibold bg-brand-50'
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className={`text-lg ${active === t.id ? 'text-brand-500' : 'text-gray-500'}`}>
              {t.icon}
            </span>
            <span className="mt-1 text-xs">{t.label}</span>
          </button>
        ))}
      </motion.div>
    </>
  );
}
