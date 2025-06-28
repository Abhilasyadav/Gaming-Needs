import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import AdminHome from "./Components/AdminComponents/AdminHome";
import SignIn from "./Components/AuthComponents/SignIn";
import SignUp from "./Components/AuthComponents/SignUp";
import CustomerHome from "./Components/CustomerComponents/CustomerHome";


import About from "./Components/CustomerComponents/About";
import Contact from "./Components/CustomerComponents/Contact";
import ProductListing from "./Components/CustomerComponents/ProductListing";
import ProductDetail from "./Components/CustomerComponents/ProductDetail";
import Cart from './Components/CustomerComponents/Cart/Cart';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './Components/AuthComponents/AuthContext'
import Orders from './Components/CustomerComponents/Orders/Orders';
import OrderSummary from './Components/CustomerComponents/Orders/OrderSummary';
import Customer from './Components/AdminComponents/CustomerManagement';

const API_BASE = import.meta.env.VITE_API_BASE;

const ProtectedRoute = ({ children, requiredRole, userRole, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/user'} replace />;
  }
  
  return children;
};

// Public Route Component
const PublicRoute = ({ children, isAuthenticated, userRole }) => {
  if (isAuthenticated) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/user'} replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/getAllProduct`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  async function handleAddToCart(product, qty = 1) {
    const jwtcode = localStorage.getItem("authToken");
    if (!jwtcode) {
      alert("Please sign in first");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(jwtcode);
    } catch (err) {
      alert("Invalid login. Please sign in again.");
      return;
    }

    const username = decoded.sub;
    if (!username) {
      alert("Please sign in first");
      return;
    }

    if (!product || !product.id) {
      alert("Invalid product ID. Please try again.");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtcode}`
        },
        body: JSON.stringify({ productId: product.id, username: username, quantity: qty }),
      });

      if (resp.ok) {
        toast.success(`Added "${product.name}" (x${qty}) to cart`);
      } else {
        const errorText = await resp.text();
        toast.error(`Could not add to cart: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not add to cart. Please try again later.");
    }
  }

  return (
    <>
      <AuthContext.Provider value={{
        isAuthenticated,
        userRole,
        setIsAuthenticated,
        setUserRole
      }}>
        <Routes>
          <Route 
            path="/signin" 
            element={
              <PublicRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <SignIn setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <SignUp />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute 
                requiredRole="ADMIN" 
                userRole={userRole} 
                isAuthenticated={isAuthenticated}
              >
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/user/*" 
            element={
              <ProtectedRoute 
                requiredRole="USER" 
                userRole={userRole} 
                isAuthenticated={isAuthenticated}
              >
                <UserRoutes 
                  products={products}
                  loading={loading}
                  error={error}
                  onAddToCart={handleAddToCart}
                  search={search}
                  setSearch={setSearch}
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Root route */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={userRole === 'ADMIN' ? '/admin' : '/user'} replace /> :
                <Navigate to="/signin" replace />
            } 
          />
          
          <Route path="*" element={<div><h1>404 Not Found</h1></div>} />
        </Routes>
      </AuthContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          fontSize: "1.1rem",
          fontFamily: "Segoe UI, Arial, sans-serif",
          borderRadius: "8px",
          width: "350px",
          zIndex: 9999
        }}
        toastStyle={{
          borderRadius: "8px",
          background: "#5CB338",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(82, 186, 177, 0.78)"
        }}
      />
    </>
  );
}


const UserRoutes = ({ products, loading, error, onAddToCart, search, setSearch }) => {
  const jwtcode = localStorage.getItem("authToken");
  const decoded = jwtDecode(jwtcode);
  const username = decoded.sub;
  return (
    <Routes>
      <Route 
        index 
        element={
          <CustomerHome 
            products={products}
            loading={loading}
            error={error}
            onAddToCart={onAddToCart}
            search={search}
            setSearch={setSearch}
          />
        } 
      />
      
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="cart" element={<Cart username={username} />} />
      <Route path="order" element={<Orders username={username}/>} />
      <Route path="order-summary/:orderId" element={<OrderSummary />} />
      <Route path="customermanagement" element={<Customer />} />
      
      <Route
        path="products"
        element={
          <ProductListing
            products={products}
            loading={loading}
            error={error}
            onAddToCart={onAddToCart}
          />
        }
      />
      <Route
        path="product/:id"
        element={<ProductDetail products={products} onAddToCart={onAddToCart} />}
      />
      
      {/* Catch all for user routes - redirect to user home */}
      <Route path="*" element={<Navigate to="/user" replace />} />
    </Routes>
  );
};

export default App;