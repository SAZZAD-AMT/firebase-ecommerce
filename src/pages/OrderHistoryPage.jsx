// src/pages/OrderHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, "orders");
        let q;
        if (user.role === "admin") {
          q = query(ordersRef); // Admin sees all orders
        } else {
          q = query(ordersRef, where("user_id", "==", user.user_id)); // Only user's orders
        }
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="order-history-page">
      <h2>Order History</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.created_at.seconds * 1000).toLocaleString()}</td>
              <td>{order.total_price}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryPage;
