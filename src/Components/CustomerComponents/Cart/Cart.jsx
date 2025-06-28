import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CartItem from './CartItem';
import loadRazorpay from '../../../utils/loadRezorpay';
import './Cart.css';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';

const API_BASE = import.meta.env.VITE_API_BASE;

const Cart = ({ username }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      await fetch(`${API_BASE}/cart/add?username=${username}&productId=${productId}&quantity=${change}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ productId: productId, username: username, quantity: change }),
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetch(`${API_BASE}/cart/remove?username=${username}&productId=${productId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/clear?username=${username}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      if (res.ok) {
        setCart({ cartItems: [] });
      }
      fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-outer-wrapper">
          <div className="cart-container">
            <div className="cart-header">
              <h2>{username}'s Cart</h2>
            </div>
            <div className="cart-empty-message-centered">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!cart || !cart.cartItems?.length) {
    return (
      <>
        <Navbar />
        <div className="cart-outer-wrapper">
          <div className="cart-container">
            <div className="cart-header" style={{ justifyContent: "center" }}>
              <h2 style={{ margin: 0, textAlign: "center", width: "100%" }}>{username}'s Cart</h2>
            </div>
            <div className="cart-empty-message-centered">
              <span>Your cart is empty</span>
              <button className="nav-btn" onClick={() =>navigate('/')}>+</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <button
                className="clear-btn"
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 28px",
                  fontWeight: "bold",
                  fontSize: "1em",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const total = cart.cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  async function payNow() {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const ok = await loadRazorpay();
    if (!ok) return alert("Razorpay SDK failed to load. Check your internet.");

    const res = await fetch(`${API_BASE}/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({ username, amount: total * 100 }),
    });
    if (!res.ok) return alert(await res.text());
    const data = await res.json();

    const rzp = new window.Razorpay({
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "Gaming Needs",
      description: "Order Payment",
      order_id: data.orderId,
      handler: async (resp) => {
        const vr = await fetch(`${API_BASE}/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify({
            username,
            orderId: resp.razorpay_order_id,
            paymentId: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          }),
        });
        if (!vr.ok) return alert(await vr.text());
        let order_id = await vr.text();
        try {
          const parsed = JSON.parse(order_id);
          order_id = parsed.orderId || order_id;
        } catch {
        }
        console.log("Payment successful, order ID:", order_id);
        if (typeof navigate === "function") {
          navigate(`/user/order-summary/${order_id}`);
        } else {
          window.location.href = `/user/order-summary/${order_id}`;
        }
      },
      prefill: {
        name: username,
        email: localStorage.getItem("email") || "",
      },
      theme: { color: "#3399cc" },
    });
    rzp.open();
  }

  return (
    <>
      <Navbar />
      <div className="cart-outer-wrapper">
        <div className="cart-container">
          <div className="cart-header" style={{ justifyContent: "center" }}>
            <h2 style={{ margin: 0, textAlign: "center", width: "100%" }}>{username}'s Cart</h2>
          </div>

          {cart.cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onAdd={() => updateQuantity(item.product.id, 1)}
              onRemoveOne={() => updateQuantity(item.product.id, -1)}
              onDelete={() => removeItem(item.product.id)}
            />
          ))}

          <div className="total-section">
            <h3>Total Amount:</h3>
            <div className="total-amount">₹{total.toFixed(0)}</div>
          </div>

          <div className="buy-section">
            <button className="buy-btn" onClick={payNow}>🛒 Buy Now</button>
            <button
              className="clear-btn"
              style={{
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 28px",
                marginLeft: "18px",
                fontWeight: "bold",
                fontSize: "1em",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

