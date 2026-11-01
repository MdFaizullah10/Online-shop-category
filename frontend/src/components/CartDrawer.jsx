import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * CartDrawer Component
 * Interactive slide-out cart sidebar showing items, quantities, subtotal, and checkout demo.
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  // Format currency in INR (₹)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const tax = Math.round(subtotal * 0.18); // 18% GST standard
  const grandTotal = subtotal + shipping + tax;

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutComplete(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="cart-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <ShoppingBag size={20} className="cart-icon" />
            <h2 className="cart-title">Your Shopping Cart</h2>
            <span className="cart-count-badge">
              {cart.reduce((total, item) => total + item.quantity, 0)} items
            </span>
          </div>
          <button
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close cart"
            title="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="cart-shipping-banner">
          {subtotal >= 5000 ? (
            <span className="free-shipping-tag">🎉 Congratulations! You unlocked FREE Delivery</span>
          ) : (
            <span>
              Add <strong>{formatCurrency(5000 - subtotal)}</strong> more for <strong>FREE Delivery</strong>
            </span>
          )}
        </div>

        {/* Drawer Body: Items or Empty state */}
        <div className="cart-body">
          {checkoutComplete ? (
            <div className="cart-checkout-success">
              <CheckCircle2 size={54} className="success-icon" />
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for testing the shopping cart flow. Your demo order #SN-{Math.floor(100000 + Math.random() * 900000)} has been confirmed.</p>
              <span className="redirecting-note">Resetting cart & returning to catalog...</span>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-illustration">
                <ShoppingBag size={48} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Explore our hierarchical category catalog to discover premium products.</p>
              <button className="browse-products-btn" onClick={onClose}>
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="cart-item-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-category">
                      {item.category} / {item.subCategory}
                    </span>
                    <span className="cart-item-unit-price">
                      {formatCurrency(item.price)}
                    </span>

                    <div className="cart-item-controls">
                      {/* Quantity decrement & increment */}
                      <div className="quantity-group">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove item button */}
                      <button
                        className="cart-remove-item-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Pricing Breakdown & Checkout */}
        {!checkoutComplete && cart.length > 0 && (
          <div className="cart-footer">
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="breakdown-row">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="free-text">FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div className="breakdown-row">
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Grand Total</span>
                <span className="total-amount">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
