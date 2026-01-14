// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // list of categories
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch categories from the 'categories' collection
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.data().category_id, // map Firestore field
        name: doc.data().category_name
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch products from the 'products' collection
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let q;

      if (selectedCategory === 'all') {
        q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      } else {
        q = query(
          collection(db, 'products'),
          where('category_id', '==', selectedCategory),
          orderBy('created_at', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: d.product_id || doc.id,
          name: d.product_name,
          imageUrl: d.image_url,
          price: d.sell_price,
          description: d.product_description,
          stock: d.stock_qty,
          categoryId: d.category_id,
          createdAt: d.created_at,
          updatedAt: d.updated_at
        };
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products again when selectedCategory changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container">
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        marginBottom: '3rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to ShopHub</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Discover amazing products at great prices</p>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Shop by Category</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <h3>No products found</h3>
          <p>Check back later for new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
