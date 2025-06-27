import React, { useState, useEffect } from 'react'; 
import AdminSidebar from './AdminSideBar';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import ProductViewEdit from './ProductViewEdit';
import OrderAdmin from './OrdersAdmin'; 
import CustomerManagement from './CustomerManagement';
import { toast } from 'react-toastify';

export default function AdminHome({ onLogout }) {
  const [activeContent, setActiveContent] = useState('product_list');
  const [selectedProductForViewEdit, setSelectedProductForViewEdit] = useState(null);
  const [allProducts, setAllProducts] = useState([]); 

  const token = localStorage.getItem("authToken");


  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/getAllProduct', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }});
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllProducts(data); 
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };

    fetchAllProducts();
  }, []); 

  const handleMenuItemClick = (itemName) => {
    setActiveContent(itemName);
    setSelectedProductForViewEdit(null); 
  };

  const handleViewEditProduct = (productId) => {
    const productToEdit = allProducts.find(p => p.id === productId);
    if (productToEdit) {
      setSelectedProductForViewEdit(productToEdit);
      setActiveContent('view_edit_product');
    } else {
      toast.error('Product not found!',{
        backgroundColor: '#f44336',
        color: '#fff',
      }); 
      setActiveContent('product_list'); 
    }
  };

  const handleSaveProduct = (updatedProduct) => {
    console.log('Adminhome received updated product:', updatedProduct);

    setAllProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success(`Product "${updatedProduct.name}" updated successfully!`, {
      backgroundColor: '#4CAF50',});

    setActiveContent('product_list'); 
    setSelectedProductForViewEdit(null); 
  };

  const handleProductAdded = (newProduct) => {
    setAllProducts(prevProducts => [...prevProducts, newProduct]);
    setActiveContent('product_list'); 
    toast.success(`Product "${newProduct.name}" added successfully!`, {
      backgroundColor: '#4CAF50'})
  };

  const handleCancelEditProduct = () => {
    setActiveContent('product_list');
    setSelectedProductForViewEdit(null);
  };

  // --- Styles for Main Layout (No changes needed here) ---
  const adminLayoutStyles = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
  };

  const mainContentAreaStyles = {
    flexGrow: 1,
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyles = {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '2.5em',
    borderBottom: '2px solid #ccc',
    paddingBottom: '15px',
  };

  const placeholderSectionStyles = {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    maxWidth: '800px',
    margin: '30px auto',
    color: '#666',
    fontSize: '1.2em',
  };

  return (
    <div style={adminLayoutStyles}>
      {/* Admin Sidebar */}
      <AdminSidebar 
        activeItem={activeContent} 
        onMenuItemClick={handleMenuItemClick}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div style={mainContentAreaStyles}>
        <h1 style={headingStyles}>Admin Dashboard</h1>

        {activeContent === 'dashboard' && (
          <div style={placeholderSectionStyles}>
            <h2>Dashboard Overview</h2>
            <p>Welcome to your admin dashboard!</p>
          </div>
        )}

        {activeContent === 'product_list' && (
          <ProductList
            products={allProducts}
            onViewDetails={handleViewEditProduct}
            onMenuItemClick={handleMenuItemClick}
          />
        )}

        {activeContent === 'add_product' && (
          <AddProduct onProductAdded={handleProductAdded} />
        )}

        {/* View/Edit Product Page */}
        {activeContent === 'view_edit_product' && selectedProductForViewEdit && (
          <ProductViewEdit
            product={selectedProductForViewEdit}
            onSave={handleSaveProduct}
            onCancelEdit={handleCancelEditProduct}
          />
        )}

        {!selectedProductForViewEdit && activeContent === 'view_edit_product' && (
          <div style={placeholderSectionStyles}>
            <h2>Product Not Found</h2>
            <p>Please select a product from the list to view or edit its details.</p>
          </div>
        )}

        {activeContent === 'categories' && (
          <div style={placeholderSectionStyles}>
            <h2>Category Management</h2>
            <p>Manage product categories here.</p>
          </div>
        )}
        {activeContent === 'customers' && (
          <CustomerManagement/>
        )}
        {activeContent === 'orders' && (
          <OrderAdmin />
        )}
        {activeContent === 'analytics' && (
          <div style={placeholderSectionStyles}>
            <h2>Analytics & Reports</h2>
            <p>View sales data and performance metrics.</p>
          </div>
        )}
        {activeContent === 'notifications' && (
          <div style={placeholderSectionStyles}>
            <h2>Notifications Center</h2>
            <p>Manage system notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}