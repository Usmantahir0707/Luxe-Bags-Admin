import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, User, Smartphone } from "lucide-react";

export default function Users() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // SAMPLE DATA (replace with real API later)
  const users = [
    {
      id: "U-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+92 300 1234567",
      role: "customer",
      joined: "2024-11-01",
    },
    {
      id: "U-002",
      name: "Sarah Ali",
      email: "s.ali@example.com",
      phone: "+92 321 9988776",
      role: "admin",
      joined: "2024-10-15",
    },
    {
      id: "U-003",
      name: "Hamza Khan",
      email: "h.khan@example.com",
      phone: "+92 302 5566778",
      role: "customer",
      joined: "2025-01-11",
    },
  ];

  // FILTER + SEARCH
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search) ||
        u.id.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter === "all" ? true : u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [search, roleFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* SEARCH */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg bg-white shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* FILTER */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Users</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-white shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex justify-center items-center rounded-full">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2 text-gray-700 text-sm">
                <Smartphone size={18} className="text-gray-500" />
                {user.phone}
              </p>
              <p className="text-sm text-gray-500">User ID: {user.id}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Joined: {user.joined}
            </div>
          </motion.div>
        ))}
      </div>

      {/* NO RESULTS */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-10"
        >
          No users found.
        </motion.div>
      )}
    </motion.div>
  );
}
