import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import './style/ProductDetail.css';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE}/getProductById/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found.');
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch product: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    } else {
      setError('Product ID is missing.');
      setLoading(false);
    }
  }, [id]);

  // --- Loading/Error States ---
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.1em', color: '#555' }}>Loading product details...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.1em', color: '#dc3545' }}>{error}</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.1em', color: '#555' }}>Product data unavailable.</div>;
  }

  // --- Render Product Details ---
  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Back Button */}
        <button
          className="back-button"
          onClick={() => navigate('/user')}
        >
          &larr; Back to Products
        </button>

        <div className="product-header">
          <h1 className="product-name">{product.name}</h1>
          <span className="product-category">{product.category}</span>
        </div>

        <div className="content-wrapper">
          <div className="image-section">
            {product.photo ? (
              <img src={product.photo} alt={product.name} className="product-photo" />
            ) : (
              <span style={{ color: '#ccc', fontSize: '1.2em', padding: '20px' }}>No Image Available</span>
            )}
          </div>

          <div className="details-section">
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>

            <div className="action-button-container">
              <button
                className="add-to-cart-button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(product);

                  toast.success(`${product.name} has been added to your cart!`, {
                    position: "top-right",
                    style: { backgroundColor: "#4caf50", color: "#fff" }
                  });
                }}
              >
                <span className="button-icon">🛒</span> Add to Cart
              </button>
            </div>

            {/* Render specifications if available */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="specifications-section">
                <h2 className="spec-heading">Specifications:</h2>
                <ul className="spec-list">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} className="spec-item">
                      <span className="spec-label">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                      </span>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Render reviews if available */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="reviews-section">
            <h2 className="review-heading">Customer Reviews</h2>
            <ul className="review-list">
              {product.reviews.map((review, index) => (
                <li key={index} className="review-item">
                  "{review}"
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}