import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_BASE;

const SignIn = ({ setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
      const res = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const tokenString = await res.text();
        data = { token: tokenString };
      }

      const token = typeof data === 'string' ? data : data.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "ADMIN" || role === "USER") {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUserRole) setUserRole(role);
        setMessage('Signed in successfully!');
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
      console.error("Sign in error:", err);
      let errorMessage = 'Sign in failed';
      if (err.message.includes('HTTP error')) {
        errorMessage = 'Invalid credentials or server error';
      } else if (err.message.includes('Network')) {
        errorMessage = 'Network error - please check your connection';
      } else if (err.message.includes('token')) {
        errorMessage = 'Authentication error - please try again';
      }
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const isMobile = window.innerWidth <= 600;
  const themeStyles = {
    container: {
      maxWidth: isMobile ? '98vw' : '500px',
      margin: isMobile ? '16px auto' : '40px auto',
      padding: isMobile ? '16px' : '30px',
      borderRadius: '12px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff',
      color: '#333',
      width: '100%',
      boxSizing: 'border-box'
    },
    input: {
      padding: isMobile ? '8px' : '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      width: '100%',
      marginBottom: '10px',
      backgroundColor: '#fff',
      color: '#333',
      fontSize: isMobile ? '1em' : '1.05em'
    },
    button: {
      padding: isMobile ? '10px' : '12px',
      width: '100%',
      backgroundColor: isLoading ? '#ccc' : '#0056b3',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontWeight: 'bold',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
      fontSize: isMobile ? '1em' : '1.1em'
    },
    alert: {
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '8px',
      backgroundColor: message.includes('successfully') 
        ? '#d4edda' 
        : '#f8d7da',
      color: message.includes('successfully') 
        ? '#155724' 
        : '#721c24',
      border: message.includes('successfully') 
        ? '1px solid #c3e6cb' 
        : '1px solid #f5c6cb',
      fontSize: isMobile ? '1em' : '1.05em'
    },
    label: {
      fontWeight: '600',
      marginBottom: '5px',
      display: 'block',
      fontSize: isMobile ? '1em' : '1.05em'
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.95em',
      marginTop: '-8px',
      marginBottom: '8px'
    },
    linkButton: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: 0,
      fontSize: isMobile ? '0.95em' : '0.9rem'
    },
    altButton: {
      backgroundColor: '#e0e0e0',
      color: '#000',
      padding: isMobile ? '8px 10px' : '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: isMobile ? '1em' : '1.05em'
    }
  };

  return (
    <div style={themeStyles.container}>
      <h2 style={{ textAlign: 'center', fontSize: isMobile ? '1.3em' : '1.7em' }}>Sign In</h2>

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