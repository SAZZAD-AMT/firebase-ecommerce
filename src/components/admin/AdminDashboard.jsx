// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    categories: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const pendingQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'pending')
        );
        const pendingSnapshot = await getDocs(pendingQuery);

        setStats({
          totalProducts: productsSnapshot.size,
          categories: categoriesSnapshot.size,
          totalOrders: ordersSnapshot.size,
          pendingOrders: pendingSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--dark)' }}>
          👋 Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4">
        <Link to="/admin/products" className="card">
          <h4 style={{ color: 'var(--text-light)' }}>📦 Products</h4>
          <h2 style={{ marginTop: '0.5rem' }}>{stats.totalProducts}</h2>
        </Link>

        <Link to="/admin/categories" className="card">
          <h4 style={{ color: 'var(--text-light)' }}>🗂️ Categories</h4>
          <h2 style={{ marginTop: '0.5rem' }}>{stats.categories}</h2>
        </Link>

        <Link to="/admin/orders" className="card">
          <h4 style={{ color: 'var(--text-light)' }}>🧾 Orders</h4>
          <h2 style={{ marginTop: '0.5rem' }}>{stats.totalOrders}</h2>
        </Link>

        <Link to="/admin/orders" className="card">
          <h4 style={{ color: 'var(--text-light)' }}>⏳ Pending</h4>
          <h2 style={{ marginTop: '0.5rem', color: 'var(--warning)' }}>
            {stats.pendingOrders}
          </h2>
        </Link>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          ⚡ Quick Actions
        </h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-primary">
            Manage Products
          </Link>
          <Link to="/admin/categories" className="btn btn-success">
            Manage Categories
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            Manage Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
