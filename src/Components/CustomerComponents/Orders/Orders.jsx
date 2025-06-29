import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nanbar from "../Navbar";
import "./Orders.css"
import { jwtDecode } from "jwt-decode";


const StarRating = ({ rating, onRate }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "#f5b301" : "#ccc",
            fontSize: "20px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const OrderTracker = ({ status }) => {
  const steps = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = steps.indexOf(status.toUpperCase());

  return (
    <div className="order-status-tracker">
      {steps.map((step, index) => (
        <div className="order-step" key={step}>
          <div className={`step-dot ${index <= currentIndex ? "active" : ""}`} />
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && (
            <div className={`step-line ${index < currentIndex ? "active" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productRatings, setProductRatings] = useState({});
  const [ratedProductIds, setRatedProductIds] = useState(new Set());
  const token = localStorage.getItem("authToken");

  const decoded = jwtDecode(token);
  const username = decoded?.sub;
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/getorders/${username}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }})
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const sortedOrders = data
          .filter((order) => order && order.status !== "CREATED")
          .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleReturn = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/orders/request-return/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
      });
      alert(await res.text());
      window.location.reload();
    } catch {
      alert("Return request failed");
    }
  };

  const isReturnEligible = (order) =>
    order.status.toUpperCase() === "DELIVERED";

  const rateProduct = async (productId, rating) => {
    if (ratedProductIds.has(productId)) return;
    try {
      const res = await fetch(`${API_BASE}/orders/products/${productId}/rate`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
        body: JSON.stringify({ rating }),
      });
      alert(await res.text());
      setRatedProductIds((prev) => new Set(prev).add(productId));
    } catch {
      alert("Failed to submit rating");
    }
  };

  return (
    <>
     <Nanbar />

      <div className="orders-container">
        <h2>Your Orders</h2>

        {loading && <p className="text-center">Loading…</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && orders.length === 0 && (
          <p>No paid or delivered orders yet.</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <h3>Order ID: {order.id}</h3>
                <OrderTracker status={order.status} />

                <p><strong>Placed On:</strong> {new Date(order.orderTime).toLocaleString()}</p>
                {order.deliveryTime && (
                  <p><strong>Delivered On:</strong> {new Date(order.deliveryTime).toLocaleString()}</p>
                )}
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.amount / 100}</p>
                <p><strong>Payment ID:</strong> {order.paymentId || "—"}</p>

                <h4>Items:</h4>
                <ul className="items-list">
                  {order.items?.map((item, index) => (
                    <li key={index} className="item-card">
                      <img
                        src={item.product?.photo}
                        alt={item.product?.name}
                        className="product-img"
                      />
                      <div className="item-details">
                        <h5>{item.product?.name || "Unknown Product"}</h5>
                        <p>Qty: {item.quantity}</p>
                        <p>Price: ₹{item.product?.price || 0}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {order.status.toUpperCase() === "DELIVERED" && (
                  <>
                    <h4>Rate Products:</h4>
                    <ul className="items-list">
                      {order.items?.map((item, idx) => {
                        const product = item.product;
                        if (!product) return null;

                        return (
                          <li key={idx} className="item-card">
                            <img
                              src={product.photo}
                              alt={product.name}
                              className="product-img"
                            />
                            <div className="item-details">
                              <h5>{product.name}</h5>
                              <p>Price: ₹{product.price}</p>
                              <StarRating
                                rating={productRatings[product.id] || 0}
                                onRate={(star) => {
                                  setProductRatings((prev) => ({
                                    ...prev,
                                    [product.id]: star,
                                  }));
                                  rateProduct(product.id, star);
                                }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {isReturnEligible(order) && (
                  <button
                    className="return-btn"
                    onClick={() => handleReturn(order.id)}
                  >
                    Request Return
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}