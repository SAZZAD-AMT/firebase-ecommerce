// src/components/admin/OrderManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from Firestore
  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updated_at: new Date()
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  // Filter orders by status
  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  // Generate invoice
  const generateInvoice = (order) => {
    const createdAt = order.created_at?.toDate ? order.created_at.toDate() : order.created_at;

    const invoiceData = {
      id: order.id,
      customerName: order.customer_name,
      mobile: order.mobile,
      address: order.address,
      items: order.items,
      totalAmount: parseFloat(order.total_amount),
      status: order.status,
      createdAt: createdAt ? createdAt.getTime() : Date.now()
    };

    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    window.open('/admin/invoice', '_blank');
  };

  return (
    <div>
      <h1 style={{ 
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2rem',
        color: '#1f2937'
      }}>
        📋 Manage Orders
      </h1>

      {/* Status Filter */}
      <div style={{ 
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`btn ${selectedStatus === status ? 'btn-primary' : 'btn-outline'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' && ` (${orders.length})`}
            {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No orders found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map(order => {
            const createdAt = order.created_at?.toDate ? order.created_at.toDate() : order.created_at;

            return (
              <div key={order.id} className="card">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {/* Order Info */}
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#1f2937'
                    }}>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <div style={{ color: '#6b7280', lineHeight: '1.8' }}>
                      <p><strong>Customer:</strong> {order.customer_name}</p>
                      <p><strong>Mobile:</strong> {order.mobile}</p>
                      <p><strong>Address:</strong> {order.address}</p>
                      <p><strong>Date:</strong> {createdAt?.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#1f2937'
                    }}>
                      Items
                    </h4>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '0.75rem',
                        alignItems: 'center'
                      }}>
                        <img
                          src={item.image_url || 'https://via.placeholder.com/60'}
                          alt={item.product_name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {item.product_name}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            ${item.price} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
                      <strong style={{ fontSize: '1.25rem', color: '#6366f1' }}>
                        Total: ${parseFloat(order.total_amount).toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: '#1f2937'
                    }}>
                      Order Status
                    </h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status),
                      borderRadius: '20px',
                      fontWeight: '600',
                      marginBottom: '1rem'
                    }}>
                      {order.status.toUpperCase()}
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="form-control"
                      style={{ marginTop: '1rem' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {order.status !== 'pending' && (
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', display: 'block' }}
                        onClick={() => generateInvoice(order)}
                      >
                        🧾 Generate Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
