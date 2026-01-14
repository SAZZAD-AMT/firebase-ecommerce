// src/components/admin/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../../config/firebase";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    categoryId: "",
    categoryName: "",
    status: "active" // optional status
  });
  const [editingId, setEditingId] = useState(null);

  // Filter/search
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  setLoading(true);
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        categoryId: d.category_id,
        categoryName: d.category_name,
        status: d.is_active ? "active" : "inactive",
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        isDeleted: d.is_deleted
      };
    });
    setCategories(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.categoryId || !form.categoryName) {
    alert("Category ID and Name are required");
    return;
  }

  const payload = {
    category_id: form.categoryId,
    category_name: form.categoryName,
    is_active: form.status === "active",
    is_deleted: false,
    updated_at: new Date()
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, "categories", editingId), payload);
    } else {
      await addDoc(collection(db, "categories"), {
        ...payload,
        created_at: new Date()
      });
    }
    resetForm();
    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Failed to save category");
  }
  };


  const resetForm = () => {
    setForm({
      categoryId: "",
      categoryName: "",
      status: "active"
    });
    setEditingId(null);
  };

  const handleEdit = (category) => {
  setForm({
    categoryId: category.categoryId || "",
    categoryName: category.categoryName || "",
    status: category.status || "active"
  });
  setEditingId(category.id);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.categoryId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || cat.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading flex justify-center items-center h-screen">
        <div className="spinner border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>
        📦 Manage Categories
      </h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search Category ID"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "250px" }}
        />

        <select
          className="form-control"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      <div className="card" style={{ marginBottom: "2rem", padding: "1rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          {editingId ? "✏️ Edit Category" : "➕ Add New Category"}
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem"
          }}
        >
          <input
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            placeholder="CategoryID (e.g. C101)"
            className="form-control"
          />
          <input
            name="categoryName"
            value={form.categoryName}
            onChange={handleChange}
            placeholder="CategoryName (e.g. Electronics)"
            className="form-control"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List */}
      {filteredCategories.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          No categories found
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem"
          }}
        >
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="card" style={{ padding: "1rem" }}>
              <h4 style={{ fontWeight: "600" }}>{cat.categoryName}</h4>
              <p style={{ color: "#6b7280" }}>ID: {cat.categoryId}</p>
              <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>
              </p>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="btn btn-outline" onClick={() => handleEdit(cat)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(cat.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
