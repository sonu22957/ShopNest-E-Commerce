import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch product catalog");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeletingId(productToDelete._id);
      const res = await fetch(`http://localhost:5000/api/products/${productToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setActionSuccess(`"${productToDelete.name}" deleted successfully.`);
      setShowDeleteModal(false);
      setProductToDelete(null);

      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products based on search term, category, and stock filter
  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    let matchesStock = true;
    if (stockFilter === "low") matchesStock = item.stock > 0 && item.stock <= 5;
    if (stockFilter === "out") matchesStock = item.stock === 0;
    if (stockFilter === "in") matchesStock = item.stock > 5;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = ["All", "Electronics", "Footwear", "Clothing", "Home & Kitchen", "Accessories"];

  return (
    <div>
      {/* ── Action Success Alert ── */}
      {actionSuccess && (
        <div className="admin-alert admin-alert-success">
          <span>✅ {actionSuccess}</span>
          <button
            className="admin-modal-close"
            onClick={() => setActionSuccess("")}
            style={{ fontSize: "1rem" }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchProducts} className="admin-btn admin-btn-sm admin-btn-secondary">
            Retry
          </button>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">
              <span>📦</span> Product Inventory ({filteredProducts.length} items)
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Manage pricing, stock levels, and store listings.
            </p>
          </div>

          <div className="admin-panel-actions">
            <Link to="/admin/add-product" className="admin-btn admin-btn-primary">
              <span>➕</span> Add New Product
            </Link>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div className="admin-filter-bar">
          <div className="admin-search-box">
            <span className="admin-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            <select
              className="admin-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">Stock: All Levels</option>
              <option value="in">In Stock (&gt; 5)</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* ── Products Table ── */}
        {loading ? (
          <div className="admin-loader-container">
            <div className="admin-spinner"></div>
            <p>Loading inventory...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="table-product-cell">
                        <img
                          src={prod.imageUrl || "https://placehold.co/100x100?text=ShopNest"}
                          alt={prod.name}
                          className="table-product-img"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100?text=Image";
                          }}
                        />
                        <div className="table-product-meta">
                          <span className="table-product-name" title={prod.name}>
                            {prod.name}
                          </span>
                          <span className="table-product-cat">
                            ID: {prod._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ color: "#cbd5e1", fontWeight: 500 }}>
                        {prod.category || "General"}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 700, color: "#ff9d4d" }}>
                          ₹{prod.price?.toLocaleString("en-IN")}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#64748b",
                              textDecoration: "line-through",
                            }}
                          >
                            ₹{prod.originalPrice?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {prod.stock === 0 ? (
                        <span className="badge badge-outstock">Out of Stock</span>
                      ) : prod.stock <= 5 ? (
                        <span className="badge badge-lowstock">Low: {prod.stock} left</span>
                      ) : (
                        <span className="badge badge-instock">{prod.stock} units</span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ color: "#fbbf24" }}>★</span>
                        <span style={{ fontWeight: 600 }}>{prod.rating || 4.5}</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          ({prod.numReviews || 0})
                        </span>
                      </div>
                    </td>

                    <td>
                      {prod.isFeatured ? (
                        <span
                          style={{
                            background: "rgba(255, 107, 0, 0.15)",
                            color: "#ff9d4d",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          ⭐ Yes
                        </span>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>No</span>
                      )}
                    </td>

                    <td>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <Link
                          to={`/admin/edit-product/${prod._id}`}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          title="Edit product"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(prod)}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          title="Delete product"
                          disabled={deletingId === prod._id}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📦</div>
            <h3>No products found</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>
              Try adjusting your search query or filters.
            </p>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && productToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Product</h3>
              <button className="admin-modal-close" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: "#e2e8f0" }}>
                Are you sure you want to permanently delete{" "}
                <strong>"{productToDelete.name}"</strong>?
              </p>
              <p style={{ color: "#f87171", fontSize: "0.85rem" }}>
                ⚠️ This action cannot be undone and the product will immediately be removed from the store catalog.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDelete}
                disabled={deletingId === productToDelete._id}
              >
                {deletingId === productToDelete._id ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
