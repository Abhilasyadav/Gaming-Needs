import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import loadRazorpay from '../../../utils/loadRezorpay';
import './Cart.css';

const Cart = ({ username }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:8080/cart/${username}`, {
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
      await fetch(`http://localhost:8080/cart/add?username=${username}&productId=${productId}&quantity=${change}`, {
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
      await fetch(`http://localhost:8080/cart/remove?username=${username}&productId=${productId}`, {
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

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!cart || !cart.cartItems?.length) return <div>Your cart is empty.</div>;

  const total = cart.cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  async function payNow() {
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const ok = await loadRazorpay();
    if (!ok) return alert("Razorpay SDK failed to load. Check your internet.");

    // Prepare order items for backend if needed
    // Example: const items = cart.cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity }));

    const res = await fetch("http://localhost:8080/payment/create", {
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
      name: "Sales Savvy",
      description: "Order Payment",
      order_id: data.orderId,
      handler: async (resp) => {
        const vr = await fetch("http://localhost:8080/payment/verify", {
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
        const orderId = await vr.text();
        // If you use react-router, import and use navigate. Otherwise, fallback:
        if (typeof navigate === "function") {
          navigate(`/order-summary/${orderId}`);
        } else {
          window.location.href = `/order-summary/${orderId}`;
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
    <div className="cart-outer-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <button className="nav-btn" onClick={() => window.history.back()}>← Back</button>
          <h2>{username}'s Cart</h2>
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
          <div className="total-amount">₹{total.toFixed(2)}</div>
        </div>

        <div className="buy-section">
          <button className="buy-btn" onClick={payNow}>🛒 Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
