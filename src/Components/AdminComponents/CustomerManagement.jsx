import React, { useEffect, useState } from "react";
import "./CustomerManagement.css";

const API_BASE = import.meta.env.VITE_API_BASE;

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/admin/getUsers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [token]);

  if (loading) return <p className="loading">Loading customers...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="customer-management">
      <h2>Customer Management</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {customers
            .filter(cust => cust.role === 'USER')
            .map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                <td>{cust.username}</td>
                <td>{cust.firstName} {cust.lastName}</td>
                <td>{cust.email}</td>
                <td>{cust.phoneNumber}</td>
                <td>{cust.role}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
