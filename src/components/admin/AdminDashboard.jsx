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
        // Fetch total products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Fetch total categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const totalCategories = categoriesSnapshot.size;

        // Fetch total orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;

        // Fetch pending orders
        const pendingQuery = query(collection(db, 'orders'), where('status', '==', 'pending'));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingOrders = pendingSnapshot.size;

        setStats({
          totalProducts,
          totalOrders,
          categories: totalCategories,
          pendingOrders,
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
    return <div className="text-center p-10">Loading stats...</div>;
  }

  const statItems = [
    { title: 'Total Products', value: stats.totalProducts, link: '/admin/products' },
    { title: 'Total Orders', value: stats.totalOrders, link: '/admin/orders' },
    { title: 'Categories', value: stats.categories, link: '/admin/categories' },
    { title: 'Pending Orders', value: stats.pendingOrders, link: '/admin/orders' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👋 Welcome, Admin!</h1>
        <p className="text-gray-600">Here’s a quick overview of your store’s performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/categories"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
