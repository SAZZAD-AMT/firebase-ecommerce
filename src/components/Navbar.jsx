// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
          {isAdmin ? (
            <>
              <Link to="/admin">Admin Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;