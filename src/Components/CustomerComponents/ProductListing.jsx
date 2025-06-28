import ProductCard from './ProductCard';

const ProductListing = ({loading, error}) => {
  if (loading) {
    return (
      <div>
        <h1 >Our Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div >
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
