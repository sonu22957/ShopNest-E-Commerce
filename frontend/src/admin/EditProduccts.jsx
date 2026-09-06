import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const CATEGORIES = ["Electronics", "Footwear", "Clothing", "Home & Kitchen", "Accessories", "Other"];

const EditProduccts = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Electronics",
    customCategory: "",
    stock: 20,
    rating: 4.5,
    numReviews: 0,
    imageUrl: "",
    isFeatured: false,
    extraImages: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Product not found or invalid ID");
        }
        const data = await res.json();

        const isStandardCat = CATEGORIES.includes(data.category);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          originalPrice: data.originalPrice || "",
          category: isStandardCat ? data.category : "Other",
          customCategory: !isStandardCat ? data.category : "",
          stock: data.stock !== undefined ? data.stock : 20,
          rating: data.rating || 4.5,
          numReviews: data.numReviews || 0,
          imageUrl: data.imageUrl || "",
          isFeatured: Boolean(data.isFeatured),
          extraImages: Array.isArray(data.images) ? data.images.join(", ") : "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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
      setError("Please provide a description.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please specify a valid selling price.");
      return;
    }

    const resolvedCategory =
      formData.category === "Other" && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

    try {
      setSaving(true);

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

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: bodyData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      setSuccess(`Product "${formData.name}" updated successfully!`);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong updating product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loader-container">
        <div className="admin-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  const activeDisplayImg =
    filePreview || formData.imageUrl.trim() || "https://placehold.co/600x400?text=Product+Image";

  return (
    <div>
      <div className="admin-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 className="admin-panel-title">
              <span>✏️</span> Edit Product
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Update catalog details, pricing, and stock quantity for ID: {id}
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
                {CATEGORIES.map((c) => (
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
              <label className="admin-label">Current Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                className="admin-input"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Rating (0 - 5)</label>
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
              className="admin-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* ── Image options ── */}
          <div className="admin-input-group">
            <label className="admin-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="admin-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Or Replace With File Upload</label>
            <input
              type="file"
              accept="image/*"
              className="admin-input"
              onChange={handleFileChange}
              style={{ padding: "0.55rem" }}
            />
          </div>

          <div className="admin-input-group">
            <label className="admin-label">Extra Images (comma separated URLs)</label>
            <input
              type="text"
              name="extraImages"
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
              <span>Feature this product on storefront highlights</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ flex: 1, padding: "0.9rem" }}
            >
              {saving ? "Saving Changes..." : "💾 Save Changes"}
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
                  e.target.src = "https://placehold.co/600x400?text=Image+Load+Error";
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
                  {formData.description || "Product description preview..."}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduccts;
