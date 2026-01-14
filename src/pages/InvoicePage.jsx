// src/pages/admin/InvoicePage.jsx
import React, { useEffect, useState } from 'react';

const InvoicePage = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('invoiceData');
    if (data) {
      setInvoice(JSON.parse(data));
    }
  }, []);

  if (!invoice) return <div>Loading invoice...</div>;

  const { id, customerName, mobile, address, items, totalAmount, status } = invoice;


  const dateStr = invoice.created_at
    ? new Date(invoice.created_at).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
    : new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });


  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🧾 ShopHub Invoice</h1>
        <p>Keep Smilling and be with us...</p>
      </div>

      {/* Customer Info */}
      <div style={{ marginBottom: '2rem' }}>
        <div><strong>Order ID:</strong> {id}</div>
        <div><strong>Date:</strong> {dateStr}</div>
        <div><strong>Customer:</strong> {customerName}</div>
        <div><strong>Mobile:</strong> {mobile}</div>
        <div><strong>Address:</strong> {address}</div>
        <div><strong>Status:</strong> {status.toUpperCase()}</div>
      </div>

      {/* Items Table */}
      <h3>Items</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #d1d5db', padding: '0.5rem' }}>Product</th>
            <th style={{ borderBottom: '1px solid #d1d5db', padding: '0.5rem' }}>Image</th>
            <th style={{ borderBottom: '1px solid #d1d5db', padding: '0.5rem' }}>Qty</th>
            <th style={{ borderBottom: '1px solid #d1d5db', padding: '0.5rem' }}>Price</th>
            <th style={{ borderBottom: '1px solid #d1d5db', padding: '0.5rem' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: '0.5rem' }}>{item.product_name}</td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                <img src={item.image_url} alt={item.product_name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Amount */}
      <div style={{ textAlign: 'right', fontSize: '1.25rem', fontWeight: '600', color: '#6366f1' }}>
        Total Amount: ${totalAmount.toFixed(2)}
      </div>

      {/* Print Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={() => window.print()} className="btn btn-primary">
          🖨️ Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
