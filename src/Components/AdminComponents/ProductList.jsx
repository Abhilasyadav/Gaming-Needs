import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function ProductList({ products, onViewDetails, onMenuItemClick}) {

  const containerStyles = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const titleStyles = {
    fontSize: '1.4em',
    fontWeight: 'bold',
    color: '#333',
  };

  const actionsStyles = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  };

  const actionButtonStyles = {
    padding: '8px 15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '0.9em',
    color: '#555',
  };

  const seeAllButtonStyles = {
    ...actionButtonStyles,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
  };

  const tableWrapperStyles = {
    overflowX: 'auto',
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const thStyles = {
    textAlign: 'left',
    padding: '12px 15px',
    backgroundColor: '#f8f8f8',
    color: '#666',
    fontWeight: 'normal',
    fontSize: '0.9em',
    borderBottom: '1px solid #eee',
  };

  const tdStyles = {
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    color: '#333',
    fontSize: '0.9em',
    verticalAlign: 'middle',
  };


  const clickableRowStyles = {
    cursor: 'pointer',
  };


  const photoCellStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '4px',
    objectFit: 'cover',
    marginRight: '10px',
  };

  const statusBaseStyles = {
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8em',
    fontWeight: 'bold',
    display: 'inline-block',
  };

  const statusScheduledStyles = {
    ...statusBaseStyles,
    backgroundColor: '#ffe0b2',
    color: '#fb8c00',
  };

  const statusActiveStyles = {
    ...statusBaseStyles,
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  };

  const statusDraftStyles = {
    ...statusBaseStyles,
    backgroundColor: '#e3f2fd',
    color: '#2196f3',
  };

  const paginationContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9em',
    color: '#666',
  };

  const paginationButtonStyles = {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    margin: '0 5px',
    color: '#555',
  };

  const paginationActiveButtonStyles = {
    ...paginationButtonStyles,
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
  };

  const token  = localStorage.getItem('authToken')

  const handleDeleteProduct = async (productId) => {
  const id = productId;
  try {
    const res = await fetch(`http://localhost:8080/deleteProduct/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      toast.success("Product deleted successfully");
      // console.log("Product deleted successfully");
    } else {
      const errorText = await res.text();
      console.error("Failed to delete product:", errorText);
    }
  } catch (error) {
    console.error("Network or server error:", error);
  }
};

 let user_Id = "";
  try {
    const token2 = localStorage.getItem("authToken");
    const decoded = jwtDecode(token2);
    user_Id = decoded.id || decoded.userId || decoded.sub || "";
  } catch (e) {
    user_Id = "";
  }


  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={titleStyles}>Products List</h2>
        <div style={actionsStyles}>
          {/* <button style={actionButtonStyles}>Filter</button> */}
          <button style={seeAllButtonStyles} onClick={() => onMenuItemClick('add_product')}>+ Add new</button>
        </div>
      </div>

      <div style={tableWrapperStyles}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Product Name</th>
              <th style={thStyles}>Category</th>
              <th style={thStyles}>Price</th>
              <th style={thStyles}>Action</th>
              <th style={thStyles}>Status</th>
              <th style={thStyles}>Details</th>
            </tr>
          </thead>
          <tbody>
            {products
            .filter((product) => product.userId === user_Id)
            .map((product) => (
              <tr key={product.id} style={clickableRowStyles} onClick={() => onViewDetails(product.id)}>
                <td style={{ ...tdStyles, display: 'flex', alignItems: 'center' }}>
                  <img src={product.photo} alt={product.name} style={photoCellStyles} />
                  {product.name}
                </td>
                <td style={tdStyles}>{product.category}</td>
                <td style={tdStyles}>₹{product.price.toFixed(2)}</td>
                <td style={tdStyles}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();              
                      handleDeleteProduct(product.id);  
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td style={tdStyles}>
                  <span
                    style={
                      product.status === 'Scheduled'
                        ? statusScheduledStyles
                        : product.status === 'Active'
                          ? statusActiveStyles
                          : statusDraftStyles
                    }
                  >
                    {product.status}
                  </span>
                </td>
                <td style={tdStyles}>
                  {/* Stop propagation to prevent the row's onClick from firing when button is clicked */}
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    textDecoration: 'underline'
                  }} onClick={(e) => { e.stopPropagation(); onViewDetails(product.id); }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={paginationContainerStyles}>
        <button style={paginationButtonStyles}>&larr; Previous</button>
        <button style={paginationButtonStyles}>Next &rarr;</button>
      </div>
    </div>
  );
}