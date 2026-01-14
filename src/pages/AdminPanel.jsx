// src/pages/AdminPanel.jsx
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../components/auth/Login";
import AdminDashboard from "../components/admin/AdminDashboard";
import CategoryManager from "../components/admin/CategoryManager";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import BusinessAnalytics from "../components/admin/BusinessAnalytics";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== "admin") {
    return <Login />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">ShopHub Admin</h2>

        <nav className="admin-nav">
          <NavLink end to="" className="nav-item">
            Dashboard
          </NavLink>
          <NavLink to="categories" className="nav-item">
            Categories
          </NavLink>
          <NavLink to="products" className="nav-item">
            Products
          </NavLink>
          <NavLink to="orders" className="nav-item">
            Orders
          </NavLink>

          <NavLink to="analytics" className="nav-item">
            Analytics
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Routes>
          {/* 📊 Analytics happens here */}
          <Route path="" element={<AdminDashboard />} />

          {/* Master data */}
          <Route path="categories" element={<CategoryManager />} />
          <Route path="products" element={<ProductManager />} />

          {/* Transaction data */}
          <Route path="orders" element={<OrderManager />} />

          {/* 📊 Analytics Route */}
          <Route path="analytics" element={<BusinessAnalytics />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
