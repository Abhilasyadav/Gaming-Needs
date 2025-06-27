import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ProductCard from './ProductCard';

export default function CustomerHome({ products, loading, error, onAddToCart }) {

  return (
    <div>
      <Navbar />
      
      <div className="customer-home-container">
        <div className="hero-section">
          <h1>Welcome to Our Store!</h1>
          <p>Discover amazing products at great prices</p>
        </div>

        <div className="featured-products">
          
          {loading && <div className="loading">Loading products...</div>}
          
          {error && <div className="error">Error: {error}</div>}
          
          {!loading && !error && products && products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
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

      <style jsx>{`
        .customer-home-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .hero-section {
          text-align: center;
          margin-bottom: 30px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
        }
        
        .hero-section h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }
        
        .quick-nav {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        
        .quick-nav button {
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .quick-nav button:hover {
          background-color: #45a049;
        }
        
        .featured-products h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          color: #333;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .loading, .error, .no-products {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }
        
        .error {
          color: #d32f2f;
          background-color: #ffebee;
          border-radius: 5px;
        }
        
        .loading {
          color: #1976d2;
        }
        
        .view-all {
          text-align: center;
          margin-top: 30px;
        }
        
        .view-all button {
          padding: 15px 30px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 18px;
          transition: background-color 0.3s;
        }
        
        .view-all button:hover {
          background-color: #1976D2;
        }
        
        .nav-link {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}