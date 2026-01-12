import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import CategoryManager from '../components/admin/CategoryManager';
import ProductManager from '../components/admin/ProductManager';
import OrderManager from '../components/admin/OrderManager';

const AdminPanel = () => {
  const { isAdmin, currentUser } = useAuth();

  if (!currentUser || !isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="container">
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="categories" style={{ marginRight: '1rem' }}>Categories</Link>
        <Link to="products" style={{ marginRight: '1rem' }}>Products</Link>
        <Link to="orders">Orders</Link>
      </nav>

      <Routes>
        <Route path="" element={<AdminDashboard />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="orders" element={<OrderManager />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
