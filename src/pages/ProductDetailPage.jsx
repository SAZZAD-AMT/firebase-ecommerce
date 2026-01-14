// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    address: '',
    quantity: 1
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
  try {
    const productSnap = await getDoc(doc(db, 'products', id));

    if (!productSnap.exists()) {
      navigate('/');
      return;
    }

    const productData = productSnap.data();

      // 🔹 Fetch category name using category_id
      let category_name = '';
      if (productData.category_id) {
        const catQuery = query(
          collection(db, 'categories'),
          where('category_id', '==', productData.category_id)
        );
        const catSnap = await getDocs(catQuery);

        if (!catSnap.empty) {
          category_name = catSnap.docs[0].data().category_name;
        }
      }

      setProduct({
        id: productSnap.id,
        ...productData,
        category_name
      });

    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const order = {
        customer_name: formData.customerName,
        mobile: formData.mobile,
        address: formData.address,
        items: [{
          product_id: product.id,
          product_name: product.product_name,
          price: product.sell_price,
          quantity: parseInt(formData.quantity),
          image_url: product.image_url
        }],
        total_amount: product.sell_price * parseInt(formData.quantity),
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      };

      await addDoc(collection(db, 'orders'), order);
      
      setShowSuccess(true);
      setFormData({
        customerName: '',
        mobile: '',
        address: '',
        quantity: 1
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container">
      {showSuccess && (
        <div className="alert alert-success">
          ✅ Order placed successfully! We'll contact you soon to confirm.
        </div>
      )}

      <button 
        onClick={() => navigate('/products')} 
        className="btn btn-outline"
        style={{ marginBottom: '2rem' }}
      >
        ← Back to Products
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '3rem'
      }}>
        {/* Product Details */}
        <div>
          <img
            src={product.image_url || 'https://via.placeholder.com/500'}
            alt={product.product_name}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}
          />
          <span style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: '#e0e7ff',
            color: '#4f46e5',
            borderRadius: '20px',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            {product.category_name}
          </span>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            {product.product_name}
          </h1>
          <p style={{ 
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            {product.product_description}
          </p>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#6366f1',
            marginBottom: '1rem'
          }}>
            ${product.sell_price.toFixed(2)}
          </div>
          {product.stock_qty > 0 ? (
            <div style={{ color: '#10b981', fontWeight: '600' }}>
              ✓ In Stock ({product.stock} available)
            </div>
          ) : (
            <div style={{ color: '#ef4444', fontWeight: '600' }}>
              ✗ Out of Stock
            </div>
          )}
        </div>

        {/* Order Form */}
        <div className="card">
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#1f2937'
          }}>
            Place Your Order
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="+1234567890"
              />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="Enter your complete delivery address"
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-control"
                required
                min="1"
                max={product.stock}
              />
            </div>

            <div style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span>Price per unit:</span>
                <span>${product.sell_price.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span>Quantity:</span>
                <span>{formData.quantity}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #d1d5db' }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#6366f1'
              }}>
                <span>Total:</span>
                <span>${(product.sell_price * formData.quantity).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}> {/* center wrapper */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || product.stock === 0}
                style={{
                  padding: '0.75rem 2rem',  // optional: make it look nice
                  fontSize: '1rem',
                  borderRadius: '8px',
                }}
              >
                {submitting ? 'Placing Order...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;