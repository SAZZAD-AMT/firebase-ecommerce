// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- useNavigate for programmatic navigation
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Products</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {products.map(product => (
          <div
            key={product.id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${product.id}`)} // <-- entire card clickable
          >
            <img
              src={product.image_url || "https://via.placeholder.com/300"}
              alt={product.product_name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <h3>{product.product_name}</h3>
            <p>${product.sell_price}</p>
            <p>{product.product_description}</p>
            <p>Stock: {product.stock_qty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
