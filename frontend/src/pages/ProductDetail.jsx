import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cardSlice";
import { getPlaceholderImage } from "../utils/placeholderImage";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found (Status: " + res.status + ")");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImg(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product detail:", err);
        setError(err.message || "Failed to load product details");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty: quantity }));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty: quantity }));
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-skeleton">
          <div className="pd-skel-img" />
          <div className="pd-skel-info">
            <div className="pd-skel-line w-60" />
            <div className="pd-skel-line w-40" />
            <div className="pd-skel-line w-80" />
            <div className="pd-skel-line w-full" />
            <div className="pd-skel-line w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="error-box" style={{ textAlign: "center", padding: "3rem" }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <h2>Product Not Found</h2>
          <p>{error || "We could not find the product you requested."}</p>
          <Link to="/shop" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productName = product.name || product.title || "Product";
  const stockCount = product.stock !== undefined ? product.stock : 20;
  const isAvailable = stockCount > 0;

  // Build images array
  const rawImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);

  const imageList = rawImages.length > 0
    ? rawImages
    : [getPlaceholderImage(productName)];

  const currentImageSrc = (!imgError && imageList[selectedImg])
    ? imageList[selectedImg]
    : getPlaceholderImage(productName);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 1.5rem" }}>
      {/* Breadcrumb */}
      <nav style={{ color: "#94a3b8", marginBottom: "24px", fontSize: "0.9rem" }}>
        <Link to="/" style={{ color: "#ff6b00", textDecoration: "none" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link to="/shop" style={{ color: "#ff6b00", textDecoration: "none" }}>Shop</Link>
        {product.category && (
          <>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color: "#ff6b00", textDecoration: "none" }}>
              {product.category}
            </Link>
          </>
        )}
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#cbd5e1" }}>{productName}</span>
      </nav>

      <div className="pd-layout">
        {/* Images Gallery */}
        <div className="pd-images">
          <div className="pd-main-img-wrap">
            <img
              src={currentImageSrc}
              alt={productName}
              className="pd-main-img"
              onError={() => setImgError(true)}
            />
            {discountPercent && (
              <span className="discount-badge" style={{ position: "absolute", top: "16px", left: "16px" }}>
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {imageList.length > 1 && (
            <div className="pd-thumbnails">
              {imageList.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${productName} ${i + 1}`}
                  className={`pd-thumb ${selectedImg === i ? "active" : ""}`}
                  onClick={() => {
                    setSelectedImg(i);
                    setImgError(false);
                  }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="pd-info">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {product.category && (
              <span className="pd-category">{product.category}</span>
            )}
            {product.rating > 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(255,183,3,0.15)", color: "#ffb703", padding: "3px 10px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: "700" }}>
                <span>★</span>
                <span>{product.rating.toFixed(1)}</span>
                {product.numReviews > 0 && (
                  <span style={{ color: "#94a3b8", fontWeight: "normal" }}>({product.numReviews} reviews)</span>
                )}
              </div>
            )}
          </div>

          <h1 className="pd-title">{productName}</h1>

          <div className="pd-price-row">
            <span className="pd-price">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="pd-original">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
                <span className="pd-discount">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <p className="pd-desc">
            {product.description || "No description available for this product."}
          </p>

          {/* Stock Status */}
          <div className="pd-stock" style={{ margin: "1rem 0" }}>
            {isAvailable ? (
              <span className="in-stock" style={{ color: "#10b981", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span>✅</span> In Stock ({stockCount} units available)
              </span>
            ) : (
              <span className="out-stock" style={{ color: "#ef4444", fontWeight: "600" }}>
                ❌ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {isAvailable && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
              <span style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: "600" }}>Quantity:</span>
              <div style={{ display: "inline-flex", alignItems: "center", background: "#1e1e38", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", overflow: "hidden" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: "transparent", border: "none", color: "#fff", width: "36px", height: "36px", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  −
                </button>
                <span style={{ padding: "0 12px", color: "#ff6b00", fontWeight: "700" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  style={{ background: "transparent", border: "none", color: "#fff", width: "36px", height: "36px", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pd-actions">
            <button
              className={`add-to-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={!isAvailable}
              id="add-to-cart-btn"
            >
              {added ? "✅ Added to Cart!" : "🛒 Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="buy-now-btn"
              style={{ cursor: "pointer", border: "none" }}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pd-meta">
            <div className="pd-meta-item">
              <span>🚚</span>
              <span>Free expedited delivery on orders over ₹499</span>
            </div>
            <div className="pd-meta-item">
              <span>↩️</span>
              <span>7-day instant hassle-free returns policy</span>
            </div>
            <div className="pd-meta-item">
              <span>🔒</span>
              <span>100% safe & verified payments via Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
