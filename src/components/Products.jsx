import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  X,
  Trash2,
  UploadCloud,
  Eraser,
  Copy,
  MoreHorizontal,
  Pencil,
  Save,
} from "lucide-react";

// Helper function to copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert(`Copied ID: ${text}`);
};

// Helper component for modals
const ModalWrapper = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    onClick={onClose} // Close on backdrop click
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh] border border-gray-200"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function Products({ products, setProducts, token }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null); // For detail/edit modal
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editForm, setEditForm] = useState(null); // State for editing

  // Initial state for Add Product form
  const initialFormState = {
    name: "",
    description: "",
    price: "",
    category: "leather",
    stock: "",
    colors: [],
    sizes: [],
    isFeatured: false,
  };

  const [form, setForm] = useState(initialFormState);
  const [colorInput, setColorInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const sizeOptions = ["sm", "md", "lg", "xlg"];
  const categoryOptions = ["leather", "tote", "premium"];

 const filtered = products.filter((p) => {
  const matchesCategory = filter === "all" || p.category === filter;
  const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
  const matchesId = p._id.toLowerCase().includes(search.toLowerCase());

  return matchesCategory && (matchesName || matchesId);
});
  const removeError = (key) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Validation logic used for both add and edit forms
  const validate = (data, isEdit = false, imageFileCheck) => {
    const err = {};
    if (!data.name.trim()) err.name = "Required";
    if (!data.description.trim()) err.description = "Required";
    if (!data.price || data.price <= 0) err.price = "Invalid price";
    if (!data.stock || data.stock < 0) err.stock = "Invalid stock";
    if (!data.colors.length) err.colors = "Add at least one color";
    if (!data.sizes.length) err.sizes = "Select at least one size";

    // Image check is only strictly required for a new product, or if a user attempts to upload a non-file during edit.
    if (isEdit && !imageFileCheck) {
      err.image = "Image file is required";
    } else if (!isEdit && !(imageFileCheck instanceof File)) {
      err.image = "Select product image";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form, false, imageFile)) return;
    try {
      // 1. Upload Image
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
      console.log(uploadData);

      if (!uploadData.success) throw new Error("Image upload failed");

      // 2. Build Product object
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

      // 3. Send to /api/products
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
      // Optional: Update local state with the new product if API returns the full product object, e.g., setProducts([...products, result.data])

      // Close modal and reset form
      setAddOpen(false);
      handleFormReset();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    
    try{
      const deleteRes = await fetch(
          `https://luxe-bags-server.onrender.com/api/products/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
        const deleteData = await deleteRes.json()
        if (!deleteData.success) throw new Error("failed to delete !");
    }
    catch(err){
      console.log(err)
    }

    // Update local state (assuming successful API call)
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setDeleteId(null);
  };

  // Update Product
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate(editForm, true, imageFile)) return;

    try {
      if (imageFile instanceof File) {
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
        console.log(uploadData);

        if (!uploadData.success) throw new Error("Image upload failed");
        //  update payload
        const updatePayload = {
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          category: editForm.category,
          stock: parseInt(editForm.stock),
          colors: editForm.colors,
          sizes: editForm.sizes,
          isFeatured: editForm.isFeatured,
          image: uploadData.url,
        };

        // 3. Send PUT request to /api/products/:id
        const updateRes = await fetch(
          `https://luxe-bags-server.onrender.com/api/products/${editForm._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatePayload),
          }
        );

        const result = await updateRes.json();
        console.log(result);
        if (!result.success) throw new Error("Data upload failed");
      } else {
        const updatePayload = {
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          category: editForm.category,
          stock: parseInt(editForm.stock),
          colors: editForm.colors,
          sizes: editForm.sizes,
          isFeatured: editForm.isFeatured,
        };
        // 3. Send PUT request to /api/products/:id
        const updateRes = await fetch(
          `https://luxe-bags-server.onrender.com/api/products/${editForm._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatePayload),
          }
        );

        const result = await updateRes.json();
        console.log(result);
        if (!result.success) throw new Error("Data upload failed");
      }
    } catch (err) {
      console.error(err);
      alert(err);
    }

    // Update local state (simulate API response)
    setProducts(
      products.map((p) => (p._id === editForm._id ? { ...p, ...editForm } : p))
    );

    setIsEditing(false);
    setDetailProduct(editForm);
  };

  const handleFormReset = () => {
    setForm(initialFormState);
    setColorInput("");
    setImageFile(null);
    setErrors({});
  };

  const handleOpenDetail = (product) => {
    setDetailProduct(product);
    setIsEditing(false); // Start in detail view
    setEditForm(null);
    setErrors({});
  };

  const handleCloseDetail = () => {
    setDetailProduct(null);
    setIsEditing(false);
    setEditForm(null);
    setImageFile(null);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    // Copy the product data into the edit form state
    setEditForm({
      ...detailProduct,
      price: String(detailProduct.price),
      stock: String(detailProduct.stock),
    });
    setImageFile(detailProduct.image);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
    setImageFile(null);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    removeError(name);
  };

  const handleEditColorAdd = () => {
    if (!colorInput.trim()) return;
    setEditForm((prev) => ({
      ...prev,
      colors: [...prev.colors, colorInput.trim()],
    }));
    setColorInput("");
    removeError("colors");
  };

  const handleEditColorRemove = (index) => {
    setEditForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index),
    }));
  };

  const handleEditSizeToggle = (size) => {
    removeError("sizes");
    const exists = editForm.sizes.includes(size);
    setEditForm((prev) => ({
      ...prev,
      sizes: exists
        ? prev.sizes.filter((x) => x !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>

        <button
          onClick={() => {
            handleFormReset();
            setAddOpen(true);
          }}
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
            placeholder="Search products by name or id"
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
            {categoryOptions.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

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
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              <img src={product.image} className="w-full h-40 object-cover" />

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <h2 className="font-semibold text-lg">{product.name}</h2>

                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <span className="font-medium text-gray-700">ID:</span>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <span className="truncate max-w-[100px] text-xs">
                      {product._id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(product._id)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-200 transition"
                      title="Copy ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 font-bold">${product.price}</p>
                <p className="text-sm text-gray-500">
                  Stock: <span className="font-semibold">{product.stock}</span>
                </p>

                <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 capitalize">
                    {product.category}
                  </span>

                  <div className="flex gap-2">
                    {/* Expand Detail Button */}
                    <button
                      onClick={() => handleOpenDetail(product)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                      title="View Details"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteId(product._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {addOpen && (
          <ModalWrapper onClose={() => setAddOpen(false)}>
            {/* HEADER */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Add Product Form
                </h2>
                <button
                  type="button"
                  onClick={handleFormReset}
                  className="text-sm flex items-center cursor-pointer text-gray-500 hover:text-blue-600 transition"
                >
                  <span>Clear all fields</span>{" "}
                  <Eraser className="text-blue-500 w-4 h-4 p-0.5" />
                </button>
              </div>

              <button
                onClick={() => setAddOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  placeholder="Elegant Bag"
                  className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => {
                    removeError("name");
                    setForm({ ...form, name: e.target.value });
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Write a short product description..."
                  className="w-full p-3 mt-1 h-28 rounded-xl shadow-inner bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.description}
                  onChange={(e) => {
                    removeError("description");
                    setForm({ ...form, description: e.target.value });
                  }}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="font-semibold text-gray-700">Price</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="149.99"
                    className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.price}
                    onChange={(e) => {
                      removeError("price");
                      setForm({ ...form, price: e.target.value });
                    }}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="font-semibold text-gray-700">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="10"
                    className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.stock}
                    onChange={(e) => {
                      removeError("stock");
                      setForm({ ...form, stock: e.target.value });
                    }}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
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
                  <span className="text-gray-600 font-medium">
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
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="font-semibold text-gray-700">Category</label>
                <select
                  name="category"
                  className="w-full p-3 mt-1 rounded-xl bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* COLORS */}
              <div>
                <label className="font-semibold text-gray-700">Colors</label>

                <div className="flex gap-2 mt-1">
                  <input
                    placeholder="red"
                    className="flex-1 p-3 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={colorInput}
                    onChange={(e) => {
                      removeError("colors");
                      setColorInput(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
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
                      className="px-3 py-1 bg-gray-200 rounded-xl text-sm font-medium flex items-center gap-2"
                    >
                      {c}
                      <button
                        type="button"
                        className="text-gray-600 hover:text-red-500"
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
                  <p className="text-red-500 text-sm mt-1">{errors.colors}</p>
                )}
              </div>

              {/* SIZES */}
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
                      className={`px-4 py-2 rounded-xl shadow transition font-medium
                        ${
                          form.sizes.includes(s)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }
                      `}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>

                {errors.sizes && (
                  <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
                )}
              </div>

              {/* FEATURED */}
              <label className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg shadow-lg hover:bg-blue-700 transition font-bold"
              >
                Save Product
              </button>
            </form>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAIL/EDIT MODAL */}
      <AnimatePresence>
        {detailProduct && (
          <ModalWrapper onClose={handleCloseDetail}>
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Product" : "Product Details"}
              </h2>

              <button
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* TOGGLE BUTTONS */}
            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition font-medium"
                  >
                    Cancel Edit
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition font-bold"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition font-medium"
                >
                  <Pencil className="w-5 h-5" />
                  Edit Product
                </button>
              )}
            </div>

            {/* DETAIL/EDIT CONTENT */}
            {!isEditing ? (
              // DETAIL VIEW
              <div className="space-y-4 pt-4">
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                />
                <DetailItem label="ID">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800 break-all">
                      {detailProduct._id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(detailProduct._id)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-200 transition"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </DetailItem>
                <DetailItem label="Name">{detailProduct.name}</DetailItem>
                <DetailItem label="Description">
                  {detailProduct.description}
                </DetailItem>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Price">
                    <span className="font-bold text-green-600">
                      ${detailProduct.price}
                    </span>
                  </DetailItem>
                  <DetailItem label="Stock">
                    <span className="font-bold">{detailProduct.stock}</span>
                  </DetailItem>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Category">
                    <span className="capitalize">{detailProduct.category}</span>
                  </DetailItem>
                  <DetailItem label="Featured">
                    {detailProduct.isFeatured ? (
                      <span className="text-blue-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </DetailItem>
                </div>
                <DetailItem label="Colors">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detailProduct.colors.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-200 rounded-xl text-sm font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </DetailItem>
                <DetailItem label="Sizes">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {detailProduct.sizes.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium uppercase"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </DetailItem>
                <DetailItem label="Created At">
                  {new Date(detailProduct.createdAt).toLocaleString()}
                </DetailItem>
              </div>
            ) : (
              // EDIT FORM VIEW
              <form onSubmit={handleUpdate} className="space-y-5 pt-4">
                {/* NAME */}
                <div>
                  <label className="font-semibold text-gray-700">Name</label>
                  <input
                    name="name"
                    placeholder="Elegant Bag"
                    className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.name}
                    onChange={handleFormChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Write a short product description..."
                    className="w-full p-3 mt-1 h-28 rounded-xl shadow-inner bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.description}
                    onChange={handleFormChange}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* PRICE + STOCK */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="font-semibold text-gray-700">Price</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="149.99"
                      className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.price}
                      onChange={handleFormChange}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="font-semibold text-gray-700">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      placeholder="10"
                      className="w-full p-3 mt-1 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editForm.stock}
                      onChange={handleFormChange}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                {/* IMAGE FILE PICKER FOR EDIT */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Product Image (Current:{" "}
                    <span className="text-blue-600 text-sm font-normal">
                      {detailProduct.image.substring(
                        detailProduct.image.lastIndexOf("/") + 1
                      )}
                    </span>
                    )
                  </label>
                  <label className="mt-2 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow-inner">
                    <UploadCloud className="w-6 h-6 text-gray-600" />
                    <span className="text-gray-600 font-medium">
                      {imageFile
                        ? imageFile.name
                        : "Select New Image (Optional)"}
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
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="font-semibold text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full p-3 mt-1 rounded-xl bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                    value={editForm.category}
                    onChange={handleFormChange}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COLORS (EDIT) */}
                <div>
                  <label className="font-semibold text-gray-700">Colors</label>

                  <div className="flex gap-2 mt-1">
                    <input
                      placeholder="red"
                      className="flex-1 p-3 rounded-xl shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={colorInput}
                      onChange={(e) => {
                        removeError("colors");
                        setColorInput(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                      onClick={handleEditColorAdd}
                    >
                      Add
                    </button>
                  </div>

                  {/* show chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editForm.colors.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-200 rounded-xl text-sm font-medium flex items-center gap-2"
                      >
                        {c}
                        <button
                          type="button"
                          className="text-gray-600 hover:text-red-500"
                          onClick={() => handleEditColorRemove(i)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {errors.colors && (
                    <p className="text-red-500 text-sm mt-1">{errors.colors}</p>
                  )}
                </div>

                {/* SIZES (EDIT) */}
                <div>
                  <label className="font-semibold text-gray-700">Sizes</label>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleEditSizeToggle(s)}
                        className={`px-4 py-2 rounded-xl shadow transition font-medium
                        ${
                          editForm.sizes.includes(s)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }
                      `}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {errors.sizes && (
                    <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
                  )}
                </div>

                {/* FEATURED (EDIT) */}
                <label className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={editForm.isFeatured}
                    onChange={handleFormChange}
                  />
                  <span className="text-gray-700 font-medium">
                    Featured Product
                  </span>
                </label>
              </form>
            )}
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-center text-red-600 flex items-center justify-center gap-2">
                <Trash2 className="w-6 h-6" /> Delete Product?
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to delete this product? This action cannot
                be undone.
                <br />
                <span className="text-xs text-gray-400">ID: {deleteId}</span>
              </p>

              <div className="flex justify-between gap-3 mt-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="w-1/2 bg-gray-200 py-2 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteId)}
                  className="w-1/2 bg-red-600 text-white py-2 rounded-xl shadow-lg hover:bg-red-700 transition font-bold"
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

// Simple component for clean detail display
const DetailItem = ({ label, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 mb-0.5">{label}</h3>
    <div className="text-gray-800">{children}</div>
  </div>
);
