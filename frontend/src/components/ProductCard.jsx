import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cardSlice";
import { getPlaceholderImage } from "../utils/placeholderImage";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const productName = product.name || product.title || "Untitled Product";
  const rawImage = product.imageUrl || product.images?.[0];
  const imageSrc = (!imgError && rawImage) ? rawImage : getPlaceholderImage(productName);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="card-link">
        <div className="card-img-wrapper">
          <img
            src={imageSrc}
            alt={productName}
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {discountPercent && (
            <span className="discount-badge">-{discountPercent}%</span>
          )}
          {product.category && (
            <span className="category-badge">{product.category}</span>
          )}
        </div>

        <div className="card-body">
          {product.rating > 0 && (
            <div className="card-rating">
              <span className="star-icon">★</span>
              <span className="rating-score">{product.rating.toFixed(1)}</span>
              {product.numReviews > 0 && (
                <span className="reviews-count">({product.numReviews})</span>
              )}
            </div>
          )}

          <h3 title={productName}>{productName}</h3>
          <p className="desc">{product.description || "No description available."}</p>

          <div className="card-footer">
            <div className="price-group">
              <span className="price">₹{product.price?.toLocaleString("en-IN") ?? "0"}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <button
              className={`add-btn ${added ? "added-state" : ""}`}
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              {added ? "✓ Added" : "🛒 Add"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;