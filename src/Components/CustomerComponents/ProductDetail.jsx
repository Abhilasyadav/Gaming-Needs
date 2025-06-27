import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail() { 
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
        const token = await localStorage.getItem("authToken");

        const response = await fetch(`http://localhost:8080/getProductById/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        }
      );

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

  // --- Styles (kept as-is from your provided code) ---
  const actionButtonContainerStyles = {
    display: 'flex',
    gap: '15px',
    marginTop: '30px',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  };

  const baseActionButtonStyles = {
    padding: '18px 35px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2em',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
    flex: '1 1 auto',
    minWidth: '200px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const addToCartButtonStyles = {
    ...baseActionButtonStyles,
    backgroundColor: '#28a745',
    color: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  };

  const addToCartButtonHoverStyles = {
    backgroundColor: '#218838',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  };

  const buyNowButtonStyles = {
    ...baseActionButtonStyles,
    backgroundColor: '#007bff',
    color: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  };

  const buyNowButtonHoverStyles = {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  };

  const buttonIconStyles = {
    marginRight: '10px',
    fontSize: '1.3em',
  };
  const pageContainerStyles = {
    fontFamily: 'Roboto, sans-serif',
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  const productHeaderStyles = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const productNameStyles = {
    fontSize: '2.8em',
    color: '#333',
    marginBottom: '10px',
  };

  const productCategoryStyles = {
    fontSize: '1.1em',
    color: '#777',
    backgroundColor: '#f0f0f0',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-block',
  };

  const contentWrapperStyles = {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    width: '100%',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const imageSectionStyles = {
    flex: '1 1 400px',
    maxWidth: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  };

  const productPhotoStyles = {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  };

  const detailsSectionStyles = {
    flex: '1 1 450px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  };

  const productDescriptionStyles = {
    fontSize: '1.1em',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
  };

  const productPriceStyles = {
    fontSize: '2.5em',
    fontWeight: '700',
    color: '#28a745',
    marginBottom: '25px',
    alignSelf: 'flex-start',
  };

  const specificationsSectionStyles = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    width: '100%',
  };

  const specHeadingStyles = {
    fontSize: '1.2em',
    color: '#333',
    marginBottom: '15px',
    fontWeight: '600',
  };

  const specListStyles = {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  };

  const specItemStyles = {
    marginBottom: '8px',
    fontSize: '0.95em',
    color: '#666',
  };

  const specLabelStyles = {
    fontWeight: '600',
    color: '#444',
    marginRight: '8px',
  };

  const reviewsSectionStyles = {
    marginTop: '30px',
    paddingTop: '30px',
    borderTop: '1px solid #eee',
    width: '100%',
  };

  const reviewHeadingStyles = {
    fontSize: '1.8em',
    color: '#333',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
  };

  const reviewListStyles = {
    listStyle: 'none',
    padding: '0',
  };

  const reviewItemStyles = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    fontSize: '0.95em',
    color: '#555',
    lineHeight: '1.5',
  };

  const backButtonStyles = {
    marginTop: '30px',
    padding: '12px 25px',
    fontSize: '1em',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    alignSelf: 'flex-start',
  };

  const backButtonHoverStyles = {
    backgroundColor: '#0056b3',
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isAddToCartHovered, setIsAddToCartHovered] = useState(false);
  const [isBuyNowHovered, setIsBuyNowHovered] = useState(false);

  // --- Loading/Error States ---
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em', color: '#555' }}>Loading product details...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em', color: '#dc3545' }}>{error}</div>;
  }


  if (!product) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em', color: '#555' }}>Product data unavailable.</div>;
  }

  // --- Render Product Details ---
  return (
    <div style={pageContainerStyles}>
      <button
        style={isButtonHovered ? { ...backButtonStyles, ...backButtonHoveredStyles } : backButtonStyles}
        onClick={() => navigate('/')}
      >
        &larr; Back to Products
      </button>

      <div style={productHeaderStyles}>
        <h1 style={productNameStyles}>{product.name}</h1>
        <span style={productCategoryStyles}>{product.category}</span>
      </div>

      <div style={contentWrapperStyles}>
        <div style={imageSectionStyles}>
          {product.photo ? (
            <img src={product.photo} alt={product.name} style={productPhotoStyles} />
          ) : (
            <span style={{ color: '#ccc', fontSize: '1.5em', padding: '20px' }}>No Image Available</span>
          )}
        </div>

        <div style={detailsSectionStyles}>
          <p style={productDescriptionStyles}>{product.description}</p>
          <p style={productPriceStyles}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</p> 

          <div style={actionButtonContainerStyles}>
            <button
              style={isAddToCartHovered ? { ...addToCartButtonStyles, ...addToCartButtonHoverStyles } : addToCartButtonStyles}
              onMouseEnter={() => setIsAddToCartHovered(true)}
              onMouseLeave={() => setIsAddToCartHovered(false)}
              onClick={() => {
                console.log(`Added ${product.name} to cart!`);
              }}
            >
              <span style={buttonIconStyles}>🛒</span> Add to Cart
            </button>

            <button
              style={isBuyNowHovered ? { ...buyNowButtonStyles, ...buyNowButtonHoverStyles } : buyNowButtonStyles}
              onMouseEnter={() => setIsBuyNowHovered(true)}
              onMouseLeave={() => setIsBuyNowHovered(false)}
              onClick={() => {
                console.log(`Buying ${product.name} now!`);
              }}
            >
              <span style={buttonIconStyles}>⚡</span> Buy Now
            </button>
          </div>

          {/* Render specifications if available */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={specificationsSectionStyles}>
              <h2 style={specHeadingStyles}>Specifications:</h2>
              <ul style={specListStyles}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} style={specItemStyles}>
                    <span style={specLabelStyles}>{key.replace(/([A-Z])/g, ' ₹1').replace(/^./, (str) => str.toUpperCase())}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Render reviews if available */}
      {product.reviews && product.reviews.length > 0 && (
        <div style={reviewsSectionStyles}>
          <h2 style={reviewHeadingStyles}>Customer Reviews</h2>
          <ul style={reviewListStyles}>
            {product.reviews.map((review, index) => (
              <li key={index} style={reviewItemStyles}>
                "{review}"
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}