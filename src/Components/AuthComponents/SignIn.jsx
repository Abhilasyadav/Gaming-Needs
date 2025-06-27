import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const SignIn = ({ setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username or Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setErrors({});

    try {
      const res = await fetch('http://localhost:8080/signin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log("Raw response:", res);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // If response is a plain JWT token string
        const tokenString = await res.text();
        data = { token: tokenString };
      }

      console.log("Parsed data =>", data);

      // Handle both cases: token in object or token as string
      const token = typeof data === 'string' ? data : data.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      
      const role = decoded.role;

      if (role === "ADMIN" || role === "USER") {
        // Store authentication data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        
        // Update parent component state
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUserRole) setUserRole(role);
        
        setMessage('Signed in successfully!');
        toast.success('Signed in successfully!', {
          position: toast.POSITION.TOP_RIGHT,})
        
        // Navigate to appropriate dashboard
        setTimeout(() => {
          if (role === "ADMIN") {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }, 1000);
        
      } else {
        throw new Error('Invalid user role');
      }

    } catch (err) {
      console.error("❌ Sign in error:", err);
      let errorMessage = 'Sign in failed';
      
      if (err.message.includes('HTTP error')) {
        errorMessage = 'Invalid credentials or server error';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Network error - please check your connection';
      } else if (err.message.includes('token')) {
        errorMessage = 'Authentication error - please try again';
      }
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,})
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const themeStyles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
      color: darkMode ? '#f5f5f5' : '#333'
    },
    input: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '100%',
      marginBottom: '10px',
      backgroundColor: darkMode ? '#2a2a2a' : '#fff',
      color: darkMode ? '#f5f5f5' : '#333'
    },
    button: {
      padding: '12px',
      width: '100%',
      backgroundColor: isLoading ? '#ccc' : (darkMode ? '#007bff' : '#0056b3'),
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1
    },
    alert: {
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '8px',
      backgroundColor: message.includes('successfully') 
        ? (darkMode ? '#1e4f1e' : '#d4edda') 
        : (darkMode ? '#4e1e1e' : '#f8d7da'),
      color: message.includes('successfully') 
        ? (darkMode ? '#90ee90' : '#155724') 
        : (darkMode ? '#ff6b6b' : '#721c24'),
      border: message.includes('successfully') 
        ? (darkMode ? '1px solid #90ee90' : '1px solid #c3e6cb') 
        : (darkMode ? '1px solid #ff6b6b' : '1px solid #f5c6cb')
    },
    label: {
      fontWeight: '600',
      marginBottom: '5px',
      display: 'block'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.85em',
      marginTop: '-8px',
      marginBottom: '8px'
    },
    themeSwitch: {
      textAlign: 'right',
      marginBottom: '10px'
    },
    linkButton: {
      background: 'none',
      border: 'none',
      color: darkMode ? '#8ab4f8' : '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: 0,
      fontSize: '0.9rem'
    },
    altButton: {
      backgroundColor: darkMode ? '#444' : '#e0e0e0',
      color: darkMode ? '#fff' : '#000',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  return (
    <div style={themeStyles.container}>
      <div style={themeStyles.themeSwitch}>
        <button onClick={toggleTheme}>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <h2 style={{ textAlign: 'center' }}>Sign In</h2>

      {message && <div style={themeStyles.alert}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={themeStyles.label}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={themeStyles.input}
            disabled={isLoading}
          />
          {errors.username && <div style={themeStyles.error}>{errors.username}</div>}
        </div>

        <div>
          <label style={themeStyles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={themeStyles.input}
            disabled={isLoading}
          />
          {errors.password && <div style={themeStyles.error}>{errors.password}</div>}
        </div>

        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            style={themeStyles.linkButton}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" style={themeStyles.button} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ marginRight: '10px' }}>Don't have an account?</span>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={themeStyles.altButton}
          disabled={isLoading}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;