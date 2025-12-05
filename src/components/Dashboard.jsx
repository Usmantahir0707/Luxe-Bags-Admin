import { motion } from "framer-motion";
import { ShoppingBag, Package, Users } from "lucide-react";

export default function Dashboard({
  ordersTotal,
  productsTotal,
  usersTotal,
  loading,
}) {
  const cards = [
    {
      title: "Total Orders",
      value: ordersTotal,
      icon: <ShoppingBag size={26} />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Products",
      value: productsTotal,
      icon: <Package size={26} />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Users",
      value: usersTotal,
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

            {loading ? (
              <motion.div
                className={`w-5 h-5 border-4 border-gray-300 rounded-full
                  ${c.title === 'Total Orders' && 'border-t-blue-500'}
                  ${c.title === 'Products' && 'border-t-purple-500'}
                  ${c.title === 'Users' && 'border-t-orange-500'}`}
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 1,
                }}
              />
            ) : (
              <p className="text-2xl font-bold">{c.value}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
