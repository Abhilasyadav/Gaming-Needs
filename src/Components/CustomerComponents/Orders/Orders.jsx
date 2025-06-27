import React, { useEffect, useState } from "react";
import "./Orders.css";

const Orders = ({ username }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
              localStorage.getItem("authToken");
      try {
        const res = await fetch(`http://localhost:8080/orders/getorders/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        setOrders(data);
      } catch (err) {
        setError("Error fetching orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchOrders();
  }, [username]);

  if (loading) return <div className="orders-container"><p>Loading orders...</p></div>;
  if (error) return <div className="orders-container"><p>{error}</p></div>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order ID: {order.id}</h3>
              <span>Status: <strong className="text-green">{order.status}</strong></span>
            </div>

            <div className="order-details">
              <p><strong>Amount:</strong> ₹{order.amount}</p>
              <p><strong>Currency:</strong> {order.currency}</p>
              <p><strong>Receipt:</strong> {order.receipt}</p>
              <p><strong>Payment ID:</strong> {order.paymentId || "N/A"}</p>
              <p><strong>Order Time:</strong> {order.orderTime?.replace("T", " ")}</p>
              {order.deliveryTime && (
                <p><strong>Delivered At:</strong> {order.deliveryTime.replace("T", " ")}</p>
              )}
            </div>

            <div className="items-section">
              <h4>Items:</h4>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="item">
                    <p><strong>Name:</strong> {item.product?.name || "N/A"}</p>
                    <p><strong>Qty:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ₹{item.product?.price ?? "N/A"}</p>
                  </div>
                ))
              ) : (
                <p>No items in this order.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
