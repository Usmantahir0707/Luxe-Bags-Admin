import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Users from "./Users";
import Settings from "./Settings";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const token = location.state.token;

  // getting data
  useEffect(() => {
    const getData = async () => {
      try {
        // all orders
        const orderData = await fetch(
          "https://luxe-bags-server.onrender.com/api/orders",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const orderRes = await orderData.json();
        setOrders(orderRes);

        // all products
        const productData = await fetch(
          "https://luxe-bags-server.onrender.com/api/products"
        );
        const productRes = await productData.json();
        setProducts(productRes);

        // all users
        const usersData = await fetch(
          "https://luxe-bags-server.onrender.com/api/auth/users",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const usersRes = await usersData.json();
        setUsers(usersRes);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, []);

  const renderScreen = () => {
    switch (active) {
      case "dashboard":
        return (
          <Dashboard
            ordersTotal={orders.length}
            productsTotal={products.count}
            usersTotal={users.length}
            loading={loading}
          />
        );
      case "orders":
        return <Orders orders={orders} setOrders={setOrders} />;
      case "products":
        return <Products />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 overflow-auto pb-20 md:pb-6"
        >
          {renderScreen()}
        </motion.div>
      </div>
    </div>
  );
}
