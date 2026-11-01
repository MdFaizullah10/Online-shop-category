import React, { useState } from "react";
import { Star, ShoppingCart, Check, Tag } from "lucide-react";

/**
 * ProductCard Component
 * Displays product image, title, pricing, discount, category badge, and Add-to-Cart button.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Format currency in Indian Rupees (₹)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <article className="product-card">
      {/* Product Image and Badges */}
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // High reliability fallback in case image CDN fails
            e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Feature badge (e.g. Bestseller, Top Rated) */}
        {product.badge && (
          <span className="product-badge feature-badge">
            <Tag size={12} className="badge-icon" />
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="product-badge discount-badge">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="product-body">
        {/* Category breadcrumb pill */}
        <div className="product-category-pill">
          <span className="cat-pill-main">{product.category}</span>
          <span className="cat-pill-divider">/</span>
          <span className="cat-pill-sub">{product.subCategory}</span>
        </div>

        {/* Product Name */}
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="product-description">{product.description}</p>

        {/* Rating and Reviews */}
        <div className="product-rating-row">
          <div className="rating-pill">
            <Star size={13} className="star-icon" fill="currentColor" />
            <span className="rating-val">{product.rating}</span>
          </div>
          <span className="reviews-count">({product.reviews} reviews)</span>
          <span className="stock-status in-stock">• In Stock</span>
        </div>

        {/* Price and CTA Row */}
        <div className="product-footer">
          <div className="price-stack">
            <span className="current-price">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="original-price">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <button
            className={`add-to-cart-btn ${isAdded ? "btn-added" : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
