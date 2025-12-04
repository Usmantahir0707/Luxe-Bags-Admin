import { motion } from "framer-motion";
import { ShoppingBag, Package, Users } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "Total Orders",
      value: "1,245",
      icon: <ShoppingBag size={26} />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Products",
      value: "350",
      icon: <Package size={26} />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Users",
      value: "980",
      icon: <Users size={26} />,
      color: "from-orange-500 to-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((c) => (
        <motion.div
          key={c.title}
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl shadow-md bg-white border flex items-center gap-4"
        >
          <div
            className={`p-4 rounded-xl bg-linear-to-br ${c.color} text-white shadow-lg`}
          >
            {c.icon}
          </div>

          <div>
            <p className="text-gray-600">{c.title}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
