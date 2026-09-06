import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    customCategory: "",
    stock: 25,
    rating: 4.8,
    numReviews: 12,
    imageUrl: "",
    isFeatured: false,
    extraImages: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = ["Electronics", "Footwear", "Clothing", "Home & Kitchen", "Accessories", "Other"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please provide a product title.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please provide a product description.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please specify a valid price.");
      return;
    }

    const resolvedCategory =
      formData.category === "Other" && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

    if (!resolvedCategory) {
      setError("Please specify a category.");
      return;
    }

    if (!formData.imageUrl.trim() && !imageFile) {
      setError("Please provide an image URL or choose an image file.");
      return;
    }

    try {
      setLoading(true);

      const bodyData = new FormData();
      bodyData.append("name", formData.name.trim());
      bodyData.append("description", formData.description.trim());
      bodyData.append("price", formData.price);
      if (formData.originalPrice) {
        bodyData.append("originalPrice", formData.originalPrice);
      }
      bodyData.append("category", resolvedCategory);
      bodyData.append("stock", formData.stock);
      bodyData.append("rating", formData.rating);
      bodyData.append("numReviews", formData.numReviews);
      bodyData.append("isFeatured", formData.isFeatured);
      bodyData.append("imageUrl", formData.imageUrl.trim());

      if (formData.extraImages.trim()) {
        const extraImgs = formData.extraImages
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean);
        extraImgs.forEach((img) => bodyData.append("images", img));
      }

      if (imageFile) {
        bodyData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: bodyData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      setSuccess(`Product "${formData.name}" created successfully!`);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      console.error("Create product error:", err);
      setError(err.message || "Something went wrong creating product");
    } finally {
      setLoading(false);
    }
  };

  const activeDisplayImg =
    filePreview || formData.imageUrl.trim() || "https://placehold.co/600x400?text=Product+Image+Preview";

  return (
    <div>
      <div className="admin-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className="admin-panel-title">
              <span>➕</span> Add New Product
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Publish new inventory item to the ShopNest store.
            </p>
          </div>
          <Link to="/admin/products" className="admin-btn admin-btn-secondary admin-btn-sm">
            ← Back to Products
          </Link>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠️ {error}</span>
          <button className="admin-modal-close" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          <span>✅ {success}</span>
        </div>
      )}

      <div className="admin-form-grid">
        {/* ── Form Card ── */}
        <form onSubmit={handleSubmit} className="admin-form-card">
          <div className="admin-input-group">
            <label className="admin-label">Product Name / Title *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="admin-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="admin-input-group">
              <label className="admin-label">Category *</label>
              <select
                name="category"
                className="admin-select"
                value={formData.category}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {formData.category === "Other" && (
              <div className="admin-input-group">
                <label className="admin-label">Custom Category Name *</label>
                <input
                  type="text"
                  name="customCategory"
                  placeholder="e.g. Watches, Sports"
                  className="admin-input"
                  value={formData.customCategory}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="admin-input-group">
              <label className="admin-label">Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="2499"
                className="admin-input"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Original / MRP Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                placeholder="3999 (for discount display)"
                className="admin-input"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="admin-input-group">
              <label className="admin-label">Initial Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                placeholder="25"
                className="admin-input"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Initial Rating (0 - 5)</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="1"
                max="5"
                className="admin-input"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Product Description *</label>
            <textarea
              name="description"
              placeholder="Highlight key specs, materials, and selling features..."
              className="admin-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Image options ── */}
          <div className="admin-input-group">
            <label className="admin-label">Primary Image URL</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              className="admin-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Provide a direct image URL (Unsplash, CDN, etc.) OR upload a file below.
            </span>
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Or Upload Image File</label>
            <input
              type="file"
              accept="image/*"
              className="admin-input"
              onChange={handleFileChange}
              style={{ padding: "0.55rem" }}
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Extra Gallery Images (comma separated URLs)</label>
            <input
              type="text"
              name="extraImages"
              placeholder="https://image1.jpg, https://image2.jpg"
              className="admin-input"
              value={formData.extraImages}
              onChange={handleChange}
            />
          </div>

          <div style={{ padding: "0.5rem 0" }}>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Feature this product on homepage carousel & top highlights</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
              style={{ flex: 1, padding: "0.9rem" }}
            >
              {loading ? "Publishing Product..." : "🚀 Publish Product"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* ── Live Preview Card ── */}
        <div>
          <div className="preview-card-wrapper">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="preview-badge-label">⚡ Live Card Preview</span>
              {formData.isFeatured && (
                <span
                  style={{
                    background: "rgba(255, 107, 0, 0.2)",
                    color: "#ff9d4d",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  FEATURED
                </span>
              )}
            </div>

            <div className="live-preview-box">
              <img
                src={activeDisplayImg}
                alt="Preview"
                className="live-preview-img"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                }}
              />
              <div className="live-preview-content">
                <div className="live-preview-category">
                  {formData.category === "Other" && formData.customCategory
                    ? formData.customCategory
                    : formData.category}
                </div>
                <div className="live-preview-title">
                  {formData.name || "Product Title Goes Here"}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#94a3b8",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {formData.description || "Product description preview will appear here..."}
                </div>

                <div className="live-preview-price-row">
                  <div className="live-preview-price">
                    ₹{formData.price ? Number(formData.price).toLocaleString("en-IN") : "0"}
                  </div>
                  {formData.originalPrice &&
                    Number(formData.originalPrice) > Number(formData.price) && (
                      <div className="live-preview-original">
                        ₹{Number(formData.originalPrice).toLocaleString("en-IN")}
                      </div>
                    )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ color: "#fbbf24", fontWeight: 600 }}>
                    ★ {formData.rating || 4.5} ({formData.numReviews || 0} reviews)
                  </span>
                  <span
                    style={{
                      color: Number(formData.stock) <= 5 ? "#fbbf24" : "#34d399",
                      fontWeight: 600,
                    }}
                  >
                    {Number(formData.stock) <= 0
                      ? "Out of Stock"
                      : `${formData.stock} In Stock`}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.78rem", color: "#64748b", textAlign: "center" }}>
              This preview reflects how customers see your item on the ShopNest store.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
