import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./BusinessAnalytics.css";

const BusinessAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    const productsCol = collection(db, "products");
    const productSnapshot = await getDocs(productsCol);
    return productSnapshot.docs.map(doc => doc.data());
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    const ordersCol = collection(db, "orders");
    const orderSnapshot = await getDocs(ordersCol);
    return orderSnapshot.docs.map(doc => doc.data());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          fetchProducts(),
          fetchOrders()
        ]);
        setProducts(productsData);
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchProducts, fetchOrders]);

  if (loading) return <p className="loading-text">Loading analytics...</p>;

  // Only include delivered orders
  const deliveredOrders = orders.filter(order => order.status === "delivered");

  // Profit calculation
  let totalRevenue = 0;
  let totalCost = 0;

  deliveredOrders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.product_id === item.product_id);
      if (product) {
        totalCost += (product.cost_price || 0) * item.quantity;
      }
    });
    totalRevenue += order.total_amount || 0;
  });

  const totalProfit = totalRevenue - totalCost;
  const totalOrders = deliveredOrders.length;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Business Analytics (Delivered Orders)</h2>
      <div className="analytics-grid">
        <div className="analytics-card orders-card">
          <h3>Total Orders Delivered</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="analytics-card revenue-card">
          <h3>Total Revenue</h3>
          <p>৳ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="analytics-card profit-card">
          <h3>Total Profit</h3>
          <p>৳ {totalProfit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessAnalytics;
