import ProductCard from './ProductCard'; 


const ProductListing = ({ products, loading, error, onAddToCart }) => {
    console.log("ProductListing received:", { products, loading, error });
  if (loading) {
    return (
      <div style={loadingErrorStyles}>
        <h1 style={pageTitleStyles}>Our Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={loadingErrorStyles}>
        <h1 style={pageTitleStyles}>Our Products</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <></>
  );
};

export default ProductListing;
