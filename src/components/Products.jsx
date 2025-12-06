import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  X,
  Trash2,
  UploadCloud,
  Eraser,
} from "lucide-react";

export default function Products({ products, setProducts, token }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "leather",
    stock: "",
    colors: [],
    sizes: [],
    isFeatured: false,
  });

  const [colorInput, setColorInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const sizeOptions = ["sm", "md", "lg", "xlg"];

  const filtered = products
    ? products.filter(
        (p) =>
          (filter === "all" || p.category === filter) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const removeError = (key) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!form.price || form.price <= 0) err.price = "Invalid price";
    if (!form.stock || form.stock < 0) err.stock = "Invalid stock";
    if (!imageFile) err.image = "Image file is required";
    if (!form.colors.length) err.colors = "Add at least one color";
    if (!form.sizes.length) err.sizes = "Select at least one size";
    if (!(imageFile instanceof File)) err.image = "Select product image";
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Upload Image
      const fd = new FormData();
      fd.append("image", imageFile);

      const uploadRes = await fetch(
        "https://luxe-bags-server.onrender.com/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );

      const uploadData = await uploadRes.json();
      console.log(uploadData)

      if (!uploadData.success) throw new Error("Image upload failed");

      // Build Product object
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        colors: form.colors,
        sizes: form.sizes,
        isFeatured: form.isFeatured,
        image: uploadData.url, 
      };

      // Send to /api/products
      const productRes = await fetch(
        "https://luxe-bags-server.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      const result = await productRes.json();
      console.log("Product added:", result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const handleFormReset = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "leather",
      stock: "",
      colors: [],
      sizes: [],
      isFeatured: false,
    });
  };
  console.log(form);
  return (
    <div className="space-y-6">
      {/* HEADER */}
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

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
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
      {/* /////////////////////////////////////////////////////////////////// */}
      {/* PRODUCT GRID */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filtered.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <img src={product.image} className="w-full h-40 object-cover" />

              <div className="p-4 space-y-2">
                {/* CHANGE #1: Show name */}
                <h2 className="font-semibold text-lg">{product.name}</h2>

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
      {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh] border border-gray-200"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add Product Form
                  </h2>
                  <span
                    onClick={() => handleFormReset()}
                    className="text-sm flex items-center cursor-pointer text-gray-500 hover:underline active:underline underline-offset-4"
                  >
                    <span>Clear all</span>{" "}
                    <Eraser className="text-blue-500 text-xs p-[3px]" />
                  </span>
                </div>

                <button onClick={() => setAddOpen(false)}>
                  <X className="w-7 h-7" />
                </button>
              </div>

              <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                {/* NAME */}
                <div>
                  <label className="font-semibold text-gray-700">Name</label>
                  <input
                    placeholder="Elegant Bag"
                    className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none"
                    value={form.name}
                    onChange={(e) => {
                      removeError("name");
                      setForm({ ...form, name: e.target.value });
                    }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Write a short product description..."
                    className="w-full p-3 mt-1 h-28 rounded-xl shadow-inner bg-gray-50 resize-none focus:outline-none"
                    value={form.description}
                    onChange={(e) => {
                      removeError("description");
                      setForm({ ...form, description: e.target.value });
                    }}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                {/* PRICE + STOCK */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="font-semibold text-gray-700">Price</label>
                    <input
                      type="number"
                      placeholder="149.99"
                      className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none"
                      value={form.price}
                      onChange={(e) => {
                        removeError("price");
                        setForm({ ...form, price: e.target.value });
                      }}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">{errors.price}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="font-semibold text-gray-700">Stock</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none"
                      value={form.stock}
                      onChange={(e) => {
                        removeError("stock");
                        setForm({ ...form, stock: e.target.value });
                      }}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm">{errors.stock}</p>
                    )}
                  </div>
                </div>

                {/* IMAGE FILE PICKER */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Product Image
                  </label>
                  <label className="mt-2 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow-inner">
                    <UploadCloud className="w-6 h-6 text-gray-600" />
                    <span className="text-gray-600">
                      {imageFile ? imageFile.name : "Select Image File"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        removeError("image");
                        setImageFile(e.target.files[0]);
                      }}
                    />
                  </label>
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image}</p>
                  )}
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    className="w-full p-3 mt-1 rounded-xl bg-gray-50 shadow-inner focus:outline-none"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="leather">Leather</option>
                    <option value="tote">Tote</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                {/* COLORS — CHANGE #2 */}
                <div>
                  <label className="font-semibold text-gray-700">Colors</label>

                  <div className="flex gap-2 mt-1">
                    <input
                      placeholder="red"
                      className="flex-1 p-3 rounded-xl shadow-inner bg-gray-50 focus:outline-none"
                      value={colorInput}
                      onChange={(e) => {
                        removeError("colors");
                        setColorInput(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                      onClick={() => {
                        if (!colorInput.trim()) return;
                        setForm({
                          ...form,
                          colors: [...form.colors, colorInput.trim()],
                        });
                        setColorInput("");
                      }}
                    >
                      Add
                    </button>
                  </div>

                  {/* show chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-200 rounded-xl text-sm flex items-center gap-2"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              colors: form.colors.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {errors.colors && (
                    <p className="text-red-500 text-sm">{errors.colors}</p>
                  )}
                </div>

                {/* SIZES — CHANGE #3 */}
                <div>
                  <label className="font-semibold text-gray-700">Sizes</label>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          removeError("sizes");
                          const exists = form.sizes.includes(s);
                          setForm({
                            ...form,
                            sizes: exists
                              ? form.sizes.filter((x) => x !== s)
                              : [...form.sizes, s],
                          });
                        }}
                        className={`px-4 py-2 rounded-xl shadow 
                          ${
                            form.sizes.includes(s)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200"
                          }
                        `}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {errors.sizes && (
                    <p className="text-red-500 text-sm">{errors.sizes}</p>
                  )}
                </div>

                {/* FEATURED */}
                <label className="flex items-center gap-3 mt-2">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  <span className="text-gray-700 font-medium">
                    Featured Product
                  </span>
                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Save Product
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
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
              <h2 className="text-xl font-bold text-center">Delete Product?</h2>
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
