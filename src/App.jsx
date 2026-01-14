// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPanel from './pages/AdminPanel';
import Login from "./components/auth/Login";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import InvoicePage from './pages/InvoicePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* ✅ Single Login Route */}
            <Route path="/login" element={<Login />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />

            {/* Admin Dashboard */}
            <Route path="/admin/*" element={<AdminPanel />} />

            <Route path="/admin/invoice" element={<InvoicePage />} />       
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
