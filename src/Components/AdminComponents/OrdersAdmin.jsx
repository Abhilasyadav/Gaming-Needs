import React, { useEffect, useState } from 'react';
import './OrdersAdmin.css';
import { toast } from 'react-toastify';

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("http://localhost:8080/orders/admin/all", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        const normalized = data.map(order => {
          const normalizedItems = order.items ? order.items.map(item => {

            let product = null;
            
            if (item.product) {
              product = item.product;
            } else if (item.productId) {
              product = {
                id: item.productId,
                name: item.productName || `Product ${item.productId}`,
                photo: item.productPhoto || '/default-product.jpg',
                price: item.productPrice || 0
              };
            }
            
            return {
              ...item,
              product: product,
              quantity: item.quantity || 1
            };
          }) : [];
          
          return {
            ...order,
            items: normalizedItems,
            status: !order.status || order.status.trim() === "" || order.status === "PAID"
              ? "Pending"
              : order.status
          };
        });
        
        setOrders(normalized);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(`Failed to fetch orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchOrders();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [token]);

  const updateStatus = async (orderId, newStatus) => {
    const statusToSet = newStatus && newStatus.trim() !== "" ? newStatus : "Pending";
    try {
      const res = await fetch(`http://localhost:8080/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(statusToSet),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: statusToSet } : o)
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(`Failed to update status: ${err.message}`, {
        style: {
          background: "#e53935", 
          color: "#fff",
          borderRadius: "8px",
          fontWeight: "bold"
        }
      });
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

  const renderOrderItem = (item, idx) => {
    const product = item.product;
    
    if (!product) {
      return (
        <div key={idx} className="order-item">
          <div className="product-placeholder">
            <div className="no-image">📦</div>
            <div>
              <p className="product-warning">⚠️ Product information unavailable</p>
              <p>Quantity: {item.quantity || 1}</p>
              {item.productId && <p>Product ID: {item.productId}</p>}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="order-item">
        <div className="product-image">
          <img 
            src={product.photo || '/default-product.jpg'} 
            alt={product.name || 'Product'} 
            onError={(e) => {
              e.target.src = '/default-product.jpg';
              e.target.alt = 'Image not available';
            }}
          />
        </div>
        <div className="product-details">
          <p className="product-name">{product.name || 'Unknown Product'}</p>
          <p>Quantity: {item.quantity || 1}</p>
          {product.price && <p>Price: ${product.price}</p>}
          {product.id && <p className="product-id">ID: {product.id}</p>}
        </div>
      </div>
    );
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

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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

      <h2 className="orders-heading">
        {selectedStatus} Orders ({filteredOrders.length})
      </h2>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No {selectedStatus.toLowerCase()} orders found.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order.id}</h3>
                <p>Order Date: {order.orderTime ? new Date(order.orderTime).toLocaleString() : "N/A"}</p>
                <p>Status: {renderBadge(order.status)}</p>
                {order.totalAmount && <p>Total: ${order.totalAmount}</p>}
              </div>

              <div className="order-items">
                <h4>Items ({order.items?.length || 0}):</h4>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => renderOrderItem(item, idx))
                ) : (
                  <p className="no-items">No items in this order.</p>
                )}
              </div>

              {renderStatusControls(order)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}