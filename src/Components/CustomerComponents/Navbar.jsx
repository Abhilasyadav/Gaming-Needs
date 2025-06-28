import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import pic from '../../assets/user.png';
import logo from '../../assets/logo.png';
import { useContext } from 'react';
import { AuthContext } from '../AuthComponents/AuthContext'
import './style/Navbar.css';


const API_BASE = import.meta.env.VITE_API_BASE;

export default function Navbar({ search, setSearch }) {
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

      const response = await fetch(`${API_BASE}/searchProduct?${queryParams}`, {
        headers: {
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

  const actionButtonStyles = {
    padding: '8px 15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '0.9em',
    color: '#555',
  };

  return (
    <>
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/user" className="navbar-brand">
            <img src={logo} alt="Gaming Needs" className="navbar-logo-img" />
          </Link>
          <input
            type="text"
            placeholder="Search by products..."
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: 220,
              fontSize: '1em'
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
              }
            }}
          />
        </div>

        <ul className="navbar-links">
          <li><NavLink to="/user">Home</NavLink></li>
          <li><NavLink to="/user/order">Orders</NavLink></li>
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
              {/* <button className="profile-edit-button">Edit Profile</button> */}
              <button
                type="button"
                style={{
                  ...actionButtonStyles,
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  marginTop: '10px',
                  width: '80%',
                  padding: '10px 15px',
                  fontSize: '0.9em',
                }}
                onClick={handleLogout}
              >
               Logout
              </button>
            </div>
          )}
        </div>

        <button className="menu-button" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <ul className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <li><NavLink to="/user" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/user/order" onClick={() => setIsMenuOpen(false)}>Orders</NavLink></li>
        <li><NavLink to="/user/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
        <li><NavLink to="/user/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
      </ul>
    </>
  );
}
