import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import pic from '../../assets/user.png';
import logo from '../../assets/gaming needs.png';
import { useContext } from 'react';
import { AuthContext } from '../AuthComponents/AuthContext'


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const profileBoxRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileBox = () => setShowProfileBox(!showProfileBox);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileBoxRef.current &&
        !profileBoxRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileBox(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const jwtcode = localStorage.getItem("authToken");
  const decoded = jwtDecode(jwtcode);
  const username = decoded.sub;
  const roles = decoded.role;
  const email = decoded.email;

  const userData = {
    username: username,
    role: roles,
    email: email,
    photo: pic
  };


  const handleSearchProduct = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('name', searchTerm);
        queryParams.append('category', searchTerm);
      }

      const response = await fetch(`http://localhost:8080/searchProduct?${queryParams}`,{
        headers : {
          "Authorization": `Bearer ${jwtcode}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/signin', { replace: true });
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .navbar-container {
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 2rem;
          font-weight: 800;
          color: #4f46e5;
          text-decoration: none;
        }

        .navbar-logo-img {
          width: 100px;
          height: 45px;
          object-fit: cover;
        }

        .navbar-links {
          display: none;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-links li {
          margin-left: 2rem;
        }

        .navbar-links a {
          color: #4b5563;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .navbar-links a:hover {
          color: #4f46e5;
        }

        .navbar-icons {
          display: flex;
          align-items: center;
          position: relative;
        }

        .navbar-icons button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #4b5563;
          margin-left: 1.5rem;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: color 0.3s ease, background-color 0.3s ease;
        }

        .navbar-icons button:hover {
          color: #4f46e5;
          background-color: #e0e7ff;
        }

        .menu-button {
          display: block;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 2rem;
          color: #1f2937;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: background-color 0.3s ease;
        }

        .menu-button:hover {
          background-color: #f3f4f6;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1rem 1.5rem;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          z-index: 999;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-menu li {
          list-style: none;
          margin: 0.75rem 0;
        }

        .mobile-menu a {
          color: #4b5563;
          text-decoration: none;
          font-weight: 600;
          display: block;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }

        .mobile-menu a:hover {
          color: #4f46e5;
        }

        .profile-box {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          width: 200px;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-box img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-bottom: 0.75rem;
          object-fit: cover;
        }

        .profile-info p {
          margin: 0.25rem 0;
          color: #374151;
          font-size: 0.9rem;
          text-align: center;
        }

        .profile-info p:first-child {
          font-weight: 700;
          font-size: 1rem;
          color: #1f2937;
        }

        .profile-logout-button,
        .profile-edit-button {
          background-color: #4f46e5;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          border: none;
          margin-top: 0.5rem;
          transition: background-color 0.3s ease;
          width: 100%;
        }

        .profile-edit-button:hover {
          background-color: #4338ca;
        }

        .profile-logout-button:hover {
          background-color: #dc2626;
        }

        @media (min-width: 768px) {
          .navbar-links {
            display: flex;
          }
          .menu-button {
            display: none;
          }
        }
        `}
      </style>

      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/user" className="navbar-brand">
            <img src={logo} alt="Logo" className="navbar-logo-img" />
            {/* <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gaming <span style={{ color: '#6366f1' }}>Needs</span></span> */}
          </Link>
          <input
            type="text"
            placeholder="Search products..."
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '0.9rem',
              outline: 'none',
              width: '200px',
              maxWidth: '100%'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchProduct}>Search</button>
        </div>

        <ul className="navbar-links">
          <li><NavLink to="/user">Home</NavLink></li>
          <li><NavLink to="/user/order">Orders</NavLink></li>
          {/* <li><NavLink to="/categories">Categories</NavLink></li> */}
          <li><NavLink to="/user/about">About</NavLink></li>
          <li><NavLink to="/user/contact">Contact</NavLink></li>

        </ul>

        <div className="navbar-icons">
          <NavLink to="/user/cart"><button>🛒</button></NavLink>
          <button onClick={toggleProfileBox} ref={profileButtonRef}>👤</button>
          {showProfileBox && (
            <div className="profile-box" ref={profileBoxRef}>
              <img src={userData.photo} alt="Profile" />
              <div className="profile-info">
                <p>{userData.username}</p>
                <p>{userData.role}</p>
                <p>{userData.email}</p>
              </div>
              <button className="profile-edit-button">Edit Profile</button>
              <button className="profile-logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <button className="menu-button" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <ul className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <li><NavLink to="/user" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/user/shop" onClick={() => setIsMenuOpen(false)}>Shop</NavLink></li>
        {/* <li><NavLink to="/categories" onClick={() => setIsMenuOpen(false)}>Categories</NavLink></li> */}
        <li><NavLink to="/user/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
        <li><NavLink to="/user/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
      </ul>
    </>
  );
}
