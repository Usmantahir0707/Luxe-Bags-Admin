import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Onboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("bags-token");

    fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw err;
          });
        }
        return res.json();
      })
      .then((data) => navigate("/home", { state: {...data, token: token} }))
      .catch((err) => {
        console.log(err);
        navigate("/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Brand Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide">
          Luxe Bags Admin Panel
        </h1>

        {/* Loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="
    w-12 h-12 
    rounded-full 
    border-4 
    border-gray-300 
    border-t-transparent
    bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500
    animate-pulse
    shadow-[0_0_20px_5px_rgba(147,51,234,0.6)]
  "
          style={{
            WebkitMask: "radial-gradient(circle, transparent 55%, black 56%)",
            mask: "radial-gradient(circle, transparent 55%, black 56%)",
          }}
        ></motion.div>

        <p className="mt-4 text-gray-600 text-sm">
          Authenticating your session...
        </p>
      </motion.div>
    </div>
  );
}
