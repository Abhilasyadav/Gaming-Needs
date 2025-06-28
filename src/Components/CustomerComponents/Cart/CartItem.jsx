import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onAdd, onRemoveOne, onDelete }) => {
  const { product, quantity } = item;

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <img src={product.photo} alt={product.name} className="product-img" />
        <div>
          <h4 className="product-name">{product.name}</h4>
          <p className="product-price">₹{product.price.toFixed(0)} × {quantity}</p>
        </div>
      </div>

      <div className="cart-item-actions">
        <button className="btn" onClick={onRemoveOne} disabled={quantity <= 1}>−</button>
        <span className="quantity">{quantity}</span>
        <button className="btn" onClick={onAdd}>+</button>
        <button className="btn remove-btn" onClick={onDelete}>X</button>
      </div>
    </div>
  );
};

export default CartItem;
