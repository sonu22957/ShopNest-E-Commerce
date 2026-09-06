import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/Shop.css";

const CATEGORIES = ["All", "Electronics", "Clothing", "Footwear", "Home & Kitchen", "Accessories"];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Server response status: " + res.status);
        return res.json();
      })
      .then((data) => {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products from server");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        (a.name || a.title || "").localeCompare(b.name || b.title || "")
      );
    }

    setFiltered(result);
  }, [search, selectedCategory, sortBy, products]);

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <h1>🛍️ All Products Collection</h1>
        <p className="shop-sub">Browse {products.length} authentic items backed by MongoDB</p>
      </div>

      {/* Category Pills */}
      <div className="category-pills" style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "1.5rem 0", justifyContent: "center" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: "50px",
              border: selectedCategory === cat ? "1px solid #ff6b00" : "1px solid rgba(255,255,255,0.1)",
              background: selectedCategory === cat ? "linear-gradient(135deg, #ff6b00, #ff8c38)" : "#1e1e38",
              color: selectedCategory === cat ? "#fff" : "#cbd5e1",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="shop-filters">
        <input
          id="shop-search"
          type="text"
          placeholder="🔍 Search by name, brand, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shop-search"
        />
        <select
          id="shop-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="shop-sort"
        >
          <option value="default">Sort: Default (Newest)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Content */}
      <div className="shop-content">
        {loading && (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {error && (
          <div className="error-box">
            <span>⚠️</span>
            <p>Could not load products from API.</p>
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
                cursor: "pointer"
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-box">
            <span className="empty-icon">🔍</span>
            <p>No products match your criteria. Try changing filters or search keyword.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              style={{
                marginTop: "12px",
                padding: "8px 18px",
                borderRadius: "6px",
                background: "#ff6b00",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="results-count">Showing {filtered.length} products</p>
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
