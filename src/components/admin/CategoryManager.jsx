// src/components/admin/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'categories'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        name: newCategory.trim(),
        createdAt: new Date(),
      });
      setCategories([...categories, { id: docRef.id, name: newCategory.trim() }]);
      setNewCategory('');
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, { name: editingName.trim() });
      setCategories(categories.map(cat => cat.id === id ? { ...cat, name: editingName.trim() } : cat));
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📂 Category Manager</h2>

      {/* Add Category */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 border rounded flex-grow"
        />
        <button
          onClick={handleAddCategory}
          className="bg-black text-white px-4 rounded hover:opacity-80"
        >
          Add
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left text-gray-600">Category ID</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Category Name</th>
              <th className="px-4 py-2 border-b text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{cat.id}</td>
                  <td className="px-4 py-2 border-b">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="p-1 border rounded w-full"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(cat.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:opacity-80"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:opacity-80"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(cat.id, cat.name)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-80"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
