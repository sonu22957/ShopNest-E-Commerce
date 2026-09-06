import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

const CATEGORIES = [
  { name: "Electronics", icon: "⚡" },
  { name: "Clothing", icon: "👕" },
  { name: "Footwear", icon: "👟" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Accessories", icon: "🕶️" }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Server error: " + response.status);
        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to connect to backend server");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).length > 0
    ? products.filter((p) => p.isFeatured)
    : products.slice(0, 8);

  return (
    <div className="home">
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">✨ Premium Quality • Best Prices</span>
          <h1 className="hero-title">
            Upgrade Your Lifestyle with <span className="brand-highlight">ShopNest</span>
          </h1>
          <p className="hero-subtitle">
            Explore authentic electronics, stylish fashion, trendy footwear, and smart home appliances.
          </p>
          <div className="hero-btns">
            <Link to="/shop" className="btn-primary">
              ⚡ Explore Collection
            </Link>
            <Link to="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">Authentic</span>
          </div>
          <div className="stat">
            <span className="stat-num">50K+</span>
            <span className="stat-label">Happy Users</span>
          </div>
          <div className="stat">
            <span className="stat-num">4.9★</span>
            <span className="stat-label">Top Rated</span>
          </div>
        </div>
      </section>

      {/* ── Category Quick Links ── */}
      <section className="categories-section" style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f8fafc", marginBottom: "1rem" }}>
          Browse Top Categories
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "50px",
                background: "#1e1e38",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#f1f5f9",
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ff6b00";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">🔥 Featured Products</h2>
            <p className="section-sub">Handpicked top deals direct from MongoDB</p>
          </div>
          <Link to="/shop" style={{ color: "#ff6b00", fontWeight: "700", textDecoration: "none", fontSize: "0.95rem" }}>
            See All →
          </Link>
        </div>

        {loading && (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {error && (
          <div className="error-box">
            <span style={{ fontSize: "2rem" }}>⚠️</span>
            <p>Could not connect to ShopNest API.</p>
            <code>{error}</code>
            <button
              onClick={fetchProducts}
              style={{
                marginTop: "12px",
                padding: "8px 18px",
                borderRadius: "6px",
                background: "#ff6b00",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div className="empty-box">
            <span className="empty-icon">📦</span>
            <p>No products found in MongoDB. Seed the database to display products.</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Why ShopNest ── */}
      <section className="features-section">
        <div className="feature">
          <span className="feature-icon">🚚</span>
          <h3>Free Fast Delivery</h3>
          <p>On all orders above ₹499</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <h3>100% Secure Payment</h3>
          <p>Protected by Razorpay & SSL</p>
        </div>
        <div className="feature">
          <span className="feature-icon">↩️</span>
          <h3>7 Days Easy Returns</h3>
          <p>Instant refunds & exchanges</p>
        </div>
        <div className="feature">
          <span className="feature-icon">💬</span>
          <h3>24/7 Dedicated Support</h3>
          <p>Real-time help whenever you need</p>
        </div>
      </section>
    </div>
  );
};

export default Home;