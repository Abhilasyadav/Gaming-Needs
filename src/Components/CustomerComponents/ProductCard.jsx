import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ id, name, description, price, photo, category, rating, onAddToCart }) {
  const cardStyles = {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    margin: '0',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '380px',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  const cardHoverStyles = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
  };

  const photoContainerStyles = {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '15px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const photoStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const nameStyles = {
    fontSize: '1.2em',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const descriptionStyles = {
    fontSize: '0.85em',
    color: '#666',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  };

  const priceStyles = {
    fontSize: '1.3em',
    fontWeight: '700',
    color: '#28a745',
    marginBottom: '10px',
  };

  const categoryStyles = {
    fontSize: '0.8em',
    color: '#888',
    marginBottom: '10px',
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  };

  const buttonStyles = {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyles = {
    backgroundColor: '#0056b3',
  };

  const ratingStyles = {
    color: '#f5a623',
    marginBottom: '10px',
    fontSize: '1rem'
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);

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
    <div
      style={isHovered ? { ...cardStyles, ...cardHoverStyles } : cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/user/product/${id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <div style={photoContainerStyles}>
          {photo ? (
            <img src={photo} alt={name} style={photoStyles} />
          ) : (
            <span style={{ color: '#ccc', fontSize: '0.9em' }}>No Image</span>
          )}
        </div>

        <h3 style={nameStyles} title={name}>{name}</h3>
        <p style={descriptionStyles}>{description}</p>
        <p style={priceStyles}>₹{price.toFixed(2)}</p>
        <p style={categoryStyles}>Category: {category}</p>
        <div style={ratingStyles}>{renderStars(rating || 0)}</div>
      </Link>

      <button
        style={isButtonHovered ? { ...buttonStyles, ...buttonHoverStyles } : buttonStyles}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const product = { id, name };
          // console.log(product);
          if (onAddToCart) onAddToCart(product);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
