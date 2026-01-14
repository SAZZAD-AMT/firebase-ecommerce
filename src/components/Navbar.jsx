// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAdmin, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🛍️ ShopHub
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          {currentUser ? (
            <div className="user-dropdown">
              {/* User Avatar or Name */}
              <div
                className="user-info"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={currentUser.image || 'https://via.placeholder.com/40/cccccc/ffffff?text=👤'}
                  alt="User Avatar"
                  className="avatar"
                />
                <span className="username">{currentUser.name}</span>
                <span className="arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    My Account
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
