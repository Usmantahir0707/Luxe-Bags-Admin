import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  X,
  Trash2,
  Package2,
} from "lucide-react";

export default function Products({products, setProducts}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  console.log(products)

  const filtered = products.filter((p) =>
    (filter === "all" || p.category === filter) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // DELETE logic
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="bg-white shadow p-3 rounded-xl flex items-center gap-2 w-full md:w-1/2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="bg-white shadow p-3 rounded-xl flex items-center gap-3">
          <Filter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="outline-none bg-transparent"
          >
            <option value="all">All</option>
            <option value="leather">Leather</option>
            <option value="tote">Tote</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* ===== PRODUCT GRID ===== */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.image}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{product.title}</h2>

                <p className="text-gray-600">${product.price}</p>

                <p className="text-sm text-gray-500">
                  Stock: <span className="font-semibold">{product.stock}</span>
                </p>

                <div className="flex justify-between items-center pt-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 capitalize">
                    {product.category}
                  </span>

                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ================================================================= */}
      {/* ================== ADD PRODUCT MODAL ============================ */}
      {/* ================================================================= */}

      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Add Product</h2>
                <button onClick={() => setAddOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* FORM (You will wire backend later) */}
              <div className="space-y-3">
                <input
                  placeholder="Product Name"
                  className="w-full p-3 border rounded-xl"
                />
                <input
                  placeholder="Price"
                  type="number"
                  className="w-full p-3 border rounded-xl"
                />
                <input
                  placeholder="Stock"
                  type="number"
                  className="w-full p-3 border rounded-xl"
                />
                <input
                  placeholder="Image URL"
                  className="w-full p-3 border rounded-xl"
                />

                <select className="w-full p-3 border rounded-xl">
                  <option value="leather">Leather</option>
                  <option value="tote">Tote</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <button
                className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition"
              >
                Save Product
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* ================== DELETE CONFIRMATION MODAL ==================== */}
      {/* ================================================================= */}

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-3"
            >
              <h2 className="text-xl font-bold text-center">
                Delete Product?
              </h2>
              <p className="text-center text-gray-600">
                This action cannot be undone.
              </p>

              <div className="flex justify-between gap-3 mt-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="w-1/2 bg-gray-200 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteId)}
                  className="w-1/2 bg-red-600 text-white py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
