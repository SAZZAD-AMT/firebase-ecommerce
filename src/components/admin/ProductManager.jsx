// src/components/admin/ProductManager.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product fields
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ name: '', price: '', category: '', image: '' });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = async () => {
    if (!newName.trim() || !newPrice.trim() || !newCategory.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        name: newName.trim(),
        price: parseFloat(newPrice),
        category: newCategory.trim(),
        image: newImage.trim() || 'https://via.placeholder.com/60',
        createdAt: new Date(),
      });
      setProducts([...products, { id: docRef.id, name: newName, price: parseFloat(newPrice), category: newCategory, image: newImage || 'https://via.placeholder.com/60' }]);
      setNewName(''); setNewPrice(''); setNewCategory(''); setNewImage('');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Edit
  const startEditing = (product) => {
    setEditingId(product.id);
    setEditingData({ name: product.name, price: product.price, category: product.category, image: product.image });
  };

  const saveEdit = async (id) => {
    if (!editingData.name.trim() || !editingData.price || !editingData.category.trim()) return;
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name: editingData.name.trim(),
        price: parseFloat(editingData.price),
        category: editingData.category.trim(),
        image: editingData.image.trim() || 'https://via.placeholder.com/60',
      });
      setProducts(products.map(p => p.id === id ? { ...p, ...editingData } : p));
      setEditingId(null);
      setEditingData({ name: '', price: '', category: '', image: '' });
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: '', price: '', category: '', image: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Product Manager</h2>

      {/* Add Product Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleAddProduct}
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={p.image || 'https://via.placeholder.com/60'}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        value={editingData.name}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{p.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        value={editingData.price}
                        onChange={(e) => setEditingData({ ...editingData, price: e.target.value })}
                        className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">${p.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        value={editingData.category}
                        onChange={(e) => setEditingData({ ...editingData, category: e.target.value })}
                        className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{p.category}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {editingId === p.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
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
  </div>);
}

export default ProductManager;