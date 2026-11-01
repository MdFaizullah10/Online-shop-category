import React from "react";
import { ArrowUpDown, X, SlidersHorizontal } from "lucide-react";

/**
 * FilterBar Component
 * Provides:
 * - Active category & search breadcrumbs
 * - Product count summary
 * - Price and rating sorting dropdown
 * - Price bracket quick filter chips
 */
export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  productCount
}) {
  const priceOptions = [
    { id: "all", label: "All Prices" },
    { id: "under-5000", label: "Under ₹5,000" },
    { id: "5000-15000", label: "₹5,000 - ₹15,000" },
    { id: "above-15000", label: "Above ₹15,000" }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-top-row">
        {/* Active filtering feedback */}
        <div className="filter-summary">
          <h1 className="active-category-title">
            {selectedCategory.name || "All Products"}
          </h1>
          <span className="results-count">
            Showing <strong>{productCount}</strong> {productCount === 1 ? "product" : "products"}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="sort-group">
          <label htmlFor="sort-select" className="sort-label">
            <ArrowUpDown size={15} />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured / Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Customer Rating</option>
            <option value="name-asc">Alphabetical: A - Z</option>
          </select>
        </div>
      </div>

      {/* Filter Badges and Price Range Chips */}
      <div className="filter-chips-row">
        <div className="price-chips">
          <span className="price-chip-label">
            <SlidersHorizontal size={13} />
            <span>Price:</span>
          </span>
          {priceOptions.map((opt) => (
            <button
              key={opt.id}
              className={`price-chip ${priceRange === opt.id ? "active" : ""}`}
              onClick={() => setPriceRange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Active Search & Category Tag dismissals */}
        <div className="active-tags">
          {searchQuery && (
            <span className="filter-tag">
              <span>Query: "{searchQuery}"</span>
              <button
                className="tag-remove-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Remove search query"
              >
                <X size={13} />
              </button>
            </span>
          )}

          {selectedCategory.id !== "all" && (
            <span className="filter-tag">
              <span>Category: {selectedCategory.name}</span>
              <button
                className="tag-remove-btn"
                onClick={() => setSelectedCategory({ type: "all", id: "all", name: "All Products" })}
                aria-label="Remove category filter"
              >
                <X size={13} />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
