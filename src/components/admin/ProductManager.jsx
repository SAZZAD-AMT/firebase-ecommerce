// src/components/admin/ProductManager.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    categoryID: '',
    name: '',
    costPrice: '',
    sellPrice: '',
    stock: '',
    imageUrl: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Fetch categories
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'categories'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      categoryId: doc.data().category_id,
      categoryName: doc.data().category_name
    }));
    setCategories(data);
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(docItem => {
        const d = docItem.data();
        const category = categories.find(c => c.categoryId === d.category_id);
        return {
          id: docItem.id,
          categoryID: d.category_id || '',
          categoryName: category ? category.categoryName : '',
          name: d.product_name || '',
          costPrice: d.cost_price || 0,
          sellPrice: d.sell_price || 0,
          stock: d.stock_qty || 0,
          imageUrl: d.image_url || '',
          description: d.product_description || '',
          isActive: d.is_active ?? true
        };
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories first
  useEffect(() => {
    fetchCategories();
  }, []);

  // Then load products after categories
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.costPrice || !form.sellPrice || !form.categoryID) {
      alert('Product name, cost price, sell price, and category are required');
      return;
    }

    const payload = {
      category_id: form.categoryID,
      product_name: form.name,
      cost_price: Number(form.costPrice),
      sell_price: Number(form.sellPrice),
      stock_qty: Number(form.stock),
      image_url: form.imageUrl,
      product_description: form.description,
      is_active: true,
      is_deleted: false,
      updated_at: new Date()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          created_at: new Date()
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setForm({
      categoryID: '',
      name: '',
      costPrice: '',
      sellPrice: '',
      stock: '',
      imageUrl: '',
      description: ''
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      categoryID: product.categoryID,
      name: product.name,
      costPrice: product.costPrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      description: product.description
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  // Filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryID === selectedCategory;
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'low' && product.sellPrice < 1000) ||
      (priceRange === 'mid' && product.sellPrice >= 1000 && product.sellPrice <= 5000) ||
      (priceRange === 'high' && product.sellPrice > 5000);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
        🛍️ Manage Products
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search product"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '250px' }}
        />
        <select
          className="form-control"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
          ))}
        </select>
        <select
          className="form-control"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="all">All Prices</option>
          <option value="low">Below 1000</option>
          <option value="mid">1000 – 5000</option>
          <option value="high">Above 5000</option>
        </select>
      </div>

      {/* Add / Edit Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>
          {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
        </h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
        >
          <select
            name="categoryID"
            value={form.categoryID}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
            ))}
          </select>

          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="form-control" />
          <input name="costPrice" value={form.costPrice} onChange={handleChange} placeholder="Cost Price" type="number" className="form-control" />
          <input name="sellPrice" value={form.sellPrice} onChange={handleChange} placeholder="Sell Price" type="number" className="form-control" />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock Quantity" type="number" className="form-control" />
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="form-control" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-control" />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
            {editingId && <button type="button" onClick={resetForm} className="btn btn-outline">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>No products found</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card">
              <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: '600' }}>{product.name}</h4>
              <p style={{ color: '#6b7280' }}>{product.categoryName}</p>
              <p>💰 Cost: ${product.costPrice}</p>
              <strong style={{ fontSize: '1.2rem', color: '#6366f1' }}>Sell: ${product.sellPrice}</strong>
              <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Stock: {product.stock}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-outline" onClick={() => handleEdit(product)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
