import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQty, removeFromCart, clearCart } from "../redux/cardSlice";
import { getPlaceholderImage } from "../utils/placeholderImage";
import "../styles/Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const updateQty = (item, qty) => {
    dispatch(updateCartQty({ id: item._id || item.id, qty }));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
          Clear All
        </button>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => {
            const rawImg = item.images?.[0] || item.imageUrl;
            const imageSrc = rawImg || getPlaceholderImage(item.name || item.title || "Product");

            return (
              <div className="cart-item" key={item._id}>
                <img
                  src={imageSrc}
                  alt={item.name || item.title}
                  className="cart-item-img"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(item.name || item.title || "Product");
                  }}
                />
                <div className="cart-item-info">
                  <h3>{item.title || item.name}</h3>
                  <p className="cart-item-price">
                    ₹{item.price?.toLocaleString("en-IN")}
                  </p>
                  <div className="qty-controls">
                    <button
                      onClick={() => updateQty(item, (item.qty || 1) - 1)}
                      disabled={(item.qty || 1) <= 1}
                    >
                      −
                    </button>
                    <span>{item.qty || 1}</span>
                    <button
                      onClick={() => updateQty(item, (item.qty || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <p className="item-subtotal">
                    ₹{((item.price || 0) * (item.qty || 1)).toLocaleString("en-IN")}
                  </p>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item._id || item.id))}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-tag">{total >= 499 ? "FREE" : "₹49"}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{(total < 499 ? total + 49 : total).toLocaleString("en-IN")}</span>
          </div>
          {total < 499 && (
            <p className="free-delivery-hint">
              Add ₹{(499 - total).toLocaleString("en-IN")} more for FREE delivery!
            </p>
          )}
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout →
          </Link>
          <Link to="/shop" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
