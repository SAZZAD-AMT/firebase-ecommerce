import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="card product-card" 
      style={{ cursor: 'pointer' }}
      onClick={handleClick} // entire card clickable
    >
      <div className="product-image">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300'} 
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      </div>
      <div className="product-info" style={{ marginTop: '1rem' }}>
        <span 
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: '#e0e7ff',
            color: '#4f46e5',
            borderRadius: '20px',
            fontSize: '0.85rem',
            marginBottom: '0.5rem'
          }}
        >
          {product.categoryName}
        </span>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: '#1f2937'
        }}>
          {product.name}
        </h3>
        <p style={{ 
          color: '#6b7280',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#6366f1'
          }}>
            ${product.price.toFixed(2)}
          </span>
          <button 
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation(); // prevent card click, optional
              handleClick();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
