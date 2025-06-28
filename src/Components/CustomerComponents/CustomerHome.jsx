import React from 'react';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import './style/CustomerHome.css';

export default function CustomerHome({ products, loading, error, onAddToCart, search, setSearch }) {
  const filteredProducts = products
    ? products.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div>
      <Navbar search={search} setSearch={setSearch} />
      <div className="customer-home-container">
        <div className="hero-section">
          <h1>Welcome to Our Store!</h1>
          <p>Discover amazing products at great prices</p>
        </div>
        <div className="featured-products">
          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  photo={product.photo}
                  category={product.category}
                  reviews={product.reviews}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            !loading && !error && <div className="no-products">No products available</div>
          )}
        </div>
      </div>
    </div>
  );
}