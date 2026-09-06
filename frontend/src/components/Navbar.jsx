import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContex";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
          <img src={logo} alt="ShopNest Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="navbar-brand-text" style={{ fontSize: "1.3rem", fontWeight: "800", background: "linear-gradient(135deg, #ff6b00, #ffa052)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ShopNest
          </span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/cart" className="nav-cart-link" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span>🛒 Cart</span>
            {totalCartCount > 0 && (
              <span
                style={{
                  background: "#ff6b00",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  padding: "2px 7px",
                  borderRadius: "50px",
                  lineHeight: "1",
                }}
              >
                {totalCartCount}
              </span>
            )}
          </Link>
        </li>

        {/* ── Admin Dashboard Link ── */}
        {user?.role === "admin" && (
          <li>
            <Link
              to="/admin"
              style={{
                background: "linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))",
                border: "1px solid rgba(255, 107, 0, 0.4)",
                color: "#ff9d4d",
                padding: "6px 12px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.2s",
              }}
            >
              <span>⚡</span> Admin Panel
            </Link>
          </li>
        )}

        <li>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
                Hi, <strong style={{ color: "#fff" }}>{user.name}</strong>
              </span>
              <button onClick={handleLogout} className="nav-auth-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-auth-btn">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;