import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cardSlice";
import { AuthContext } from "../context/AuthContex";
import { getPlaceholderImage } from "../utils/placeholderImage";
import "../styles/Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );
  const deliveryCharge = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to complete your order.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!address.fullName || !address.street || !address.city || !address.pinCode) {
      setError("Please fill in all required address fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          qty: item.qty || 1,
          price: item.price,
        })),
        totalAmount: total,
        address: {
          fullName: address.fullName,
          street: address.street,
          city: address.city,
          state: address.state || "N/A",
          country: address.country || "India",
          pinCode: address.pinCode,
        },
        paymentId: paymentMethod === "cod" ? `COD_${Date.now()}` : `ONLINE_${Date.now()}`,
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      dispatch(clearCart());
      setOrderSuccess(data.order || { _id: "ORD-" + Date.now(), totalAmount: total });
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-sub">
            Thank you for your purchase. Your order is being processed.
          </p>
          <div className="order-details-box">
            <div className="detail-row">
              <span>Order ID:</span>
              <strong>#{orderSuccess._id}</strong>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            <div className="detail-row">
              <span>Payment Mode:</span>
              <strong>{paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</strong>
            </div>
            <div className="detail-row">
              <span>Delivery To:</span>
              <strong>{address.fullName}, {address.city} - {address.pinCode}</strong>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/shop" className="btn-primary">
              Continue Shopping 🛍️
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="btn-primary">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>🔒 Secure Checkout</h1>
        <p>Complete your shipping and payment details</p>
      </div>

      {!user && (
        <div className="login-prompt-banner">
          <span>⚠️ You are not logged in. </span>
          <Link to="/login" style={{ color: "#ff6b00", fontWeight: "700", marginLeft: "6px" }}>
            Click here to Login
          </Link>{" "}
          or register before placing your order.
        </div>
      )}

      {error && <div className="checkout-error">⚠️ {error}</div>}

      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-form-section">
          <h2>📦 Shipping Address</h2>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Street Address / House No. *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>PIN Code *</label>
                <input
                  type="text"
                  name="pinCode"
                  value={address.pinCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="payment-options-section">
              <h2>💳 Payment Method</h2>
              <div className="payment-radios">
                <label className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-info">
                    <strong>💵 Cash on Delivery (COD)</strong>
                    <span>Pay with cash or UPI upon delivery</span>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === "online" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-info">
                    <strong>⚡ Online Payment (UPI / Cards / NetBanking)</strong>
                    <span>Instant verified checkout</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
              id="place-order-btn"
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                `Place Order • ₹${total.toLocaleString("en-IN")}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary-section">
          <h2>Order Summary ({cartItems.length} items)</h2>
          <div className="checkout-items-list">
            {cartItems.map((item) => {
              const imageSrc =
                item.images?.[0] ||
                item.imageUrl ||
                getPlaceholderImage(item.name || item.title || "Product");

              return (
                <div key={item._id} className="checkout-item">
                  <img
                    src={imageSrc}
                    alt={item.name || item.title}
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(item.name || item.title);
                    }}
                  />
                  <div className="item-details">
                    <span className="item-name">{item.name || item.title}</span>
                    <span className="item-qty">Qty: {item.qty || 1}</span>
                  </div>
                  <span className="item-price">
                    ₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: deliveryCharge === 0 ? "#4ade80" : "#cbd5e1" }}>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="summary-row total-row">
              <span>Total Payable</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="security-badges">
            <div>🔒 256-Bit SSL Encryption</div>
            <div>✅ 100% Buyer Protection</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
