import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Users from "./Users";
import Settings from "./Settings";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
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
        console.log(productRes)
        setProducts(productRes.data);

        // all users
        const usersData = await fetch(
          "https://luxe-bags-server.onrender.com/api/auth/users",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const usersRes = await usersData.json();
        setUsers(()=> usersRes.filter((f)=> f.role !== 'admin'));
        console.log(users)
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
            productsTotal={products.length}
            usersTotal={users.length}
            loading={loading}
            orders={orders}
            products={products}
            users={users}
          />
        );
      case "orders":
        return <Orders orders={orders} setOrders={setOrders} token={token} loading={loading}/>;
      case "products":
        return <Products products={products} setProducts={setProducts} token={token} loading={loading}/>;
      case "users":
        return <Users users={users} setUsers={setUsers} token={token}/>;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-[290px]">
        <Header />

        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderScreen()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
