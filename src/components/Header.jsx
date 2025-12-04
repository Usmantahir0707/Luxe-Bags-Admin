import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, ChevronDown, LogOut, User } from "lucide-react";

export default function Header({ admin }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="sticky top-0 bg-white shadow-sm px-4 md:px-6 py-4.5 flex items-center justify-between z-40 border-b">

      {/* Left: Title */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">
        Luxe Bags Admin
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg gap-2 w-64">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text"
            placeholder="Search…"
            className="bg-transparent w-full text-sm outline-none"
          />
        </div>

        {/* Notifications */}
        <motion.div 
          whileTap={{ scale: 0.85 }}
          className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.div>

        {/* User Profile */}
        <div 
          className="relative"
        >
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-semibold shadow">
              A
            </div>
            <ChevronDown size={18} className="text-gray-600" />
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-44 bg-white shadow-xl rounded-lg py-2 border z-50"
              >
                

                <button 
                  className="w-full flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    localStorage.removeItem("bags-token");
                    window.location.href = "/login";
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
