import React from "react";
import { ShoppingBag, Search, ShoppingCart, Menu, X } from "lucide-react";

/**
 * Header Component
 * Provides:
 * - Brand logo & title
 * - Global search bar with instant query updates
 * - Mobile sidebar toggle button
 * - Shopping cart icon with dynamic badge count
 */
export default function Header({
  searchQuery,
  setSearchQuery,
  cartItemCount,
  setIsCartOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Mobile category sidebar toggle button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle category menu"
          title="Toggle Categories"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand identity */}
        <div className="brand-logo" onClick={() => setSearchQuery("")}>
          <div className="logo-icon-wrapper">
            <ShoppingBag className="logo-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">ShopNest</span>
            <span className="brand-subtitle">Category Catalog</span>
          </div>
        </div>

        {/* Search input with clear button */}
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by title, category, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Cart trigger button with item counter */}
        <div className="header-actions">
          <button
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping cart with ${cartItemCount} items`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="cart-badge" aria-live="polite">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="cart-label">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
