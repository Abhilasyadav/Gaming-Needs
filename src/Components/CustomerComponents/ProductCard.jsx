import React from 'react';
import { Link } from 'react-router-dom';
import './style/ProductCart.css';

export default function ProductCard({ id, name, description, price, photo, category, rating, onAddToCart }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push('★');
    if (halfStar) stars.push('☆');
    while (stars.length < 5) stars.push('☆');
    return stars.join(' ');
  };

  return (
    <div className="product-card">
      <Link
        to={`/user/product/${id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <div className="product-photo-container">
          {photo ? (
            <img src={photo} alt={name} className="product-photo" />
          ) : (
            <span style={{ color: '#ccc', fontSize: '0.9em' }}>No Image</span>
          )}
        </div>

        <h3 className="product-name" title={name}>{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">₹{price.toFixed(2)}</p>
        <p className="product-category">Category: {category}</p>
        <div className="product-rating">{renderStars(rating || 0)}</div>
      </Link>

      <button
        className="product-btn"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          const product = { id, name };
          if (onAddToCart) onAddToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
