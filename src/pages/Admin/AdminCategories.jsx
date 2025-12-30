// src/pages/Admin/AdminCategories.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoriesAsync,
  createCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,
} from "../../features/categorySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CategoryForm({ initial = { name: "" }, onCancel, onSubmit, loading }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => setForm(initial), [initial]);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-brandRed focus:ring-brandRed/20"
          }`}
          placeholder="Enter category name"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 font-montserrat flex items-center gap-1">
            <span>⚠</span>
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-montserrat"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-brandRed text-white hover:bg-brandRed/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    if (!cat) {
      toast.error("Invalid category data");
      return;
    }
    const categoryId = cat._id || cat.id;
    if (!categoryId) {
      toast.error("Category ID not found");
      return;
    }
    setEditing(cat);
    setEditingId(categoryId);
    setShowModal(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingId) {
        // Update existing category
        await dispatch(updateCategoryAsync({ id: editingId, categoryData: payload })).unwrap();
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        await dispatch(createCategoryAsync(payload)).unwrap();
        toast.success("Category created successfully!");
      }
      setShowModal(false);
      setEditing(null);
      setEditingId(null);
      dispatch(fetchCategoriesAsync());
    } catch (err) {
      console.error(err);
      const errorMessage = err?.message || err?.error || "Failed to save category";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (cat) => {
    const ok = window.confirm(`Delete category "${cat.name}"?`);
    if (!ok) return;
    try {
      await dispatch(deleteCategoryAsync(cat._id || cat.id)).unwrap();
      toast.success("Category deleted successfully!");
      dispatch(fetchCategoriesAsync());
    } catch (err) {
      console.error(err);
      const errorMessage = err?.message || "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-sm font-montserrat uppercase tracking-widest text-brandRed">
          Category Management
        </p>
        <h1 className="mt-2 text-3xl font-playfair font-semibold text-gray-900">
          Curate the browsing experience
        </h1>
        <p className="mt-2 text-sm font-montserrat text-gray-600">
          Balance assortment depth, navigation clarity, and promotional focus per category.
        </p>
      </header>

      <div className="flex justify-end">
        <button onClick={openCreate} className="px-4 py-2 rounded-md bg-brandRed text-white">
          Add Category
        </button>
      </div>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-6">Category Coverage</h2>

        {status === "loading" && (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 font-montserrat">Loading categories…</p>
          </div>
        )}
        {status === "failed" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-montserrat flex items-center gap-2">
              <span>⚠</span>
              <span>Error: {String(error || "Failed to load categories")}</span>
            </p>
          </div>
        )}

        {status !== "loading" && status !== "failed" && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-montserrat">
                    Category Name
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider font-montserrat">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500 font-montserrat">
                      No categories yet. Click "Add Category" to create one.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr
                      key={row._id || row.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 font-montserrat">
                          {row.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(row)}
                            className="px-4 py-2 text-sm font-montserrat rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="px-4 py-2 text-sm font-montserrat rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal - simple */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-playfair font-semibold text-gray-900">
                {editing ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <CategoryForm
              initial={editing ? { name: editing.name || "" } : { name: "" }}
              onCancel={() => {
                setShowModal(false);
                setEditing(null);
                setEditingId(null);
              }}
              onSubmit={handleSubmit}
              loading={status === "loading"}
            />
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
