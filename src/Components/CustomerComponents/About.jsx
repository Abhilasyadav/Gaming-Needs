import Navbar from './Navbar';
import './style/About.css';

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="about-container">
      <h1 className="about-title">About Our Gaming Needs App</h1>

      <section className="about-section">
        <h2>Overview</h2>
        <p>
          This is a full-featured e-commerce platform built with React for the frontend
          and Spring Boot with MySQL for the backend. It supports user and admin roles
          through a secure login system.
        </p>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li>🛒 Browse and view product details</li>
          <li>📦 Add-to-cart functionality</li>
          <li>🔐 Sign In / Sign Up with JWT-based authentication</li>
          <li>🧑‍💻 Role-based access (User or Admin)</li>
          <li>👤 User dashboard with order history</li>
          <li>🛠️ Admin panel for managing products and orders</li>
          <li>💳 Checkout and payment integration</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <ol>
          <li>User signs in or registers.</li>
          <li>They choose their role: <strong>User</strong> or <strong>Admin</strong>.</li>
          <li>
            If User:
            <ul>
              <li>Can browse, shop, and view order history.</li>
            </ul>
          </li>
          <li>
            If Admin:
            <ul>
              <li>Redirected to admin dashboard.</li>
              <li>Can manage inventory and customer orders.</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="about-section">
        <h2>Technology Stack</h2>
        <ul>
          <li>Frontend: React, Fetch, CSS</li>
          <li>Backend: Spring Boot, Spring Security, Spring MVC</li>
          <li>Database: MySQL</li>
          <li>Authentication: JWT</li>
        </ul>
      </section>
    </div>
    </>
  );
};

export default About;


