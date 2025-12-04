import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Bell, Sun, Moon } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notify, setNotify] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="w-full">
      {/* PAGE TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Settings
      </motion.h2>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE OVERVIEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="text-xl font-semibold mb-4">Profile</h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-blue-400 to-purple-600" />
            <div>
              <p className="font-medium text-lg">Admin User</p>
              <p className="text-gray-500 text-sm">admin@luxebags.com</p>
            </div>
          </div>

          <div className="mt-4 text-gray-600 text-sm">
            * Admin accounts cannot be edited or removed.
          </div>
        </motion.div>

        {/* CHANGE PASSWORD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock size={20} /> Change Password
          </h3>

          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Current Password"
              className="p-3 border rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              className="p-3 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="p-3 border rounded-lg"
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 bg-blue-600 text-white p-3 rounded-lg"
            >
              Update Password
            </motion.button>
          </div>
        </motion.div>

        {/* APP PREFERENCES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="text-xl font-semibold mb-4">Preferences</h3>

          {/* DARK MODE */}
          <div className="flex justify-between items-center py-3 border-b">
            <span className="flex items-center gap-2 text-gray-700">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              Dark Mode
            </span>
            <label className="cursor-pointer relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span
                className={`absolute inset-0 rounded-full transition ${
                  darkMode ? "bg-purple-600" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition ${
                  darkMode ? "translate-x-6" : ""
                }`}
              />
            </label>
          </div>

          {/* NOTIFICATIONS */}
          <div className="flex justify-between items-center py-3">
            <span className="flex items-center gap-2 text-gray-700">
              <Bell size={18} />
              Notifications
            </span>
            <label className="cursor-pointer relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={notify}
                onChange={() => setNotify(!notify)}
              />
              <span
                className={`absolute inset-0 rounded-full transition ${
                  notify ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition ${
                  notify ? "translate-x-6" : ""
                }`}
              />
            </label>
          </div>
        </motion.div>

        {/* SECURITY SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} /> Security
          </h3>

          {/* 2FA TOGGLE */}
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700 flex items-center gap-2">
              Enable Two-Factor Authentication
            </span>

            <label className="cursor-pointer relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={twoFA}
                onChange={() => setTwoFA(!twoFA)}
              />
              <span
                className={`absolute inset-0 rounded-full transition ${
                  twoFA ? "bg-green-600" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition ${
                  twoFA ? "translate-x-6" : ""
                }`}
              />
            </label>
          </div>

          {/* LAST LOGIN */}
          <div className="mt-4">
            <p className="text-gray-600 text-sm">Last login:</p>
            <p className="font-medium mt-1">January 17, 2025 • 6:14 PM</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
