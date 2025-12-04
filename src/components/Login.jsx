import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/react.svg"; // Make sure you have a logo image
import { useNavigate } from "react-router-dom";
import Overlay from "./Overlay";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    //form Validation
    const validateForm = () => {
      const complexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      const newErrors = {};
      if (password.length === 0) {
        newErrors.required = "Password is Required!";
      }
      if (password.length > 0 && password.length < 8) {
        newErrors.size = "Password must be atleast 8 characters!";
      }
      if (password.length >= 8 && !complexRegex.test(password)) {
        newErrors.format =
          "Password must include uppercase, lowercase, and a number!";
      }
      setError(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    //Form Submit
    const validated = validateForm();
    if (validated) {
      setLoading(true)
      fetch("https://luxe-bags-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "u.t.032276444668@gmail.com",
          password: password,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw err; 
            });
          }
          return res.json();
        })
        .then((data) => {
          localStorage.setItem('bags-token', data.token)
          navigate('/home', {state: data})
          setLoading(false);
        })
        .catch((err) => {
          console.log("CATCH:", err);
          setError((prev) => ({ ...prev, server: err.message }));
          setLoading(false)
          setTimeout(() => {
            setError({})
          }, 2500);
        });
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen p-4">
      {/* Loading Overlay */}
      {loading && <Overlay/>}
      {/* // Error Display */}
      {Object.keys(error).length !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-0 inset-x-0 bg-red-500 text-center p-1 text-white"
        >
          {Object.values(error)[0]}
        </motion.div>
      )}
      {/* // Login Modal */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 flex flex-col items-center"
      >
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Logo"
          className="w-24 h-24 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Luxe Bags Store
        </h2>

        {/* Form */}
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4 w-full relative"
        >
          {/* Pre-filled read-only email */}
          <motion.input
            type="text"
            value="Admin-Only"
            readOnly
            className="p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({});
              }}
              whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? (
                // Eye off icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c2.11 0 4.06.645 5.625 1.742M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l18 18"
                  />
                </svg>
              ) : (
                // Eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={` text-white p-3 flex justify-center items-center gap-2 rounded-lg font-semibold shadow  transition 
              ${loading ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading && <motion.div
      className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 1,
      }}
    />}
            {loading ? 'Connecting!' : 'Login'}
          </motion.button>
        </form>

        <motion.div
          className="text-center mt-6 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don't have credentials?{" "}
          <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
            Contact Provider
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
