import React, { useEffect, useState } from 'react';
import './OrdersAdmin.css';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function OrderAdmin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const user_id = decoded?.userId;

  useEffect(() => {
    fetch(`${API_BASE}/orders/admin/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate("/", { replace: true });
          }
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        const filtered = data.filter(order =>
          order.items.some(item => item.product && item.product.userId === user_id)
        );
        const normalized = filtered.map(order => ({
          ...order,
          status:
            !order.status || order.status.trim() === "" || order.status === "PAID"
              ? "Pending"
              : order.status
        }));
        setOrders(normalized);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
      });
  }, [navigate, user_id]);

  const updateStatus = async (orderId, newStatus) => {
    const statusToSet = newStatus && newStatus.trim() !== "" ? newStatus : "Pending";
    try {
      const res = await fetch(`${API_BASE}/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: statusToSet
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: statusToSet } : o)
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const renderStatusControls = (order) => {
    if (order.status === 'RETURN_REQUESTED') {
      return (
        <div className="return-request-actions">
          <label>Handle Return Request:</label>
          <select
            onChange={e => updateStatus(order.id, e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Choose</option>
            <option value="RETURN_ACCEPTED">Accept</option>
            <option value="RETURN_REJECTED">Reject</option>
          </select>
        </div>
      );
    } else if (order.status !== 'RETURN_ACCEPTED' && order.status !== 'RETURN_REJECTED') {
      return (
        <div className="status-update">
          <label>Change Status:</label>
          <select
            value={order.status}
            onChange={e => updateStatus(order.id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderBadge = (status) => {
    if (status === "PAID") status = "Pending";
    const map = {
      Pending: { class: "badge pending", label: "⏳ Pending" },
      Processing: { class: "badge processing", label: "🔄 Processing" },
      Shipped: { class: "badge shipped", label: "📦 Shipped" },
      Delivered: { class: "badge delivered", label: "✅ Delivered" },
      Cancelled: { class: "badge cancelled", label: "❌ Cancelled" },
      RETURN_REQUESTED: { class: "badge return-request", label: "↩️ Return Requested" },
      RETURN_ACCEPTED: { class: "badge return-accepted", label: "✅ Return Accepted" },
      RETURN_REJECTED: { class: "badge return-rejected", label: "❌ Return Rejected" },
    };
    const badge = map[status] || { class: "badge", label: status };
    return <span className={badge.class}>{badge.label}</span>;
  };

  const filteredOrders = selectedStatus === "All"
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "RETURN_REQUESTED",
    "RETURN_ACCEPTED",
    "RETURN_REJECTED"
  ];

  return (
    <div className="admin-page">

      <div className="status-navbar">
        {statusOptions.map(status => (
          <button
            key={status}
            className={`status-tab ${selectedStatus === status ? "active" : ""}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      <h2 className="orders-heading">{selectedStatus} Orders</h2>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Order ID: {order.id}</h3>
            <p>Order Date: {new Date(order.orderTime).toLocaleString()}</p>
            <p>Status: {renderBadge(order.status)}</p>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  {item.product ? (
                    <>
                      <img src={item.product.photo} alt={item.product.name} />
                      <div>
                        <p className="product-name">{item.product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="product-warning">⚠️ Product not found</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='user-info'>
              <p><strong>User ID:</strong> {order.userId || order.user?.id || "N/A"}</p>
              <p>
                <strong>User Name:</strong>{" "}
                {
                  order.userName ||
                  (order.user?.firstName && order.user?.lastName
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.user?.name || order.user?.username || "N/A")
                }
              </p>
            </div>
            {renderStatusControls(order)}
          </div>
        ))}
      </div>
    </div>
  );
}