import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/Header";
import CategoryTree from "./components/CategoryTree";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "./data/products";
import {
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Database,
  RefreshCw,
  Server
} from "lucide-react";
import "./App.css";

// Backend API URL from environment variable or default local Express port
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

/**
 * Main Application Component (App.jsx)
 * TW-3 College Full Stack Web Development Project:
 * Title: Online Shopping Category Page
 * Problem Statement: Large numbers of products require structured categorization
 * for efficient browsing using hierarchical HTML lists.
 * Architecture: MERN Stack (React frontend + Express & MongoDB backend)
 */
export default function App() {
  // 1. Data States (Fetched via REST API)
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [apiSource, setApiSource] = useState("connecting");

  // 2. Active Filter States
  const [selectedCategory, setSelectedCategory] = useState({
    type: "all",
    id: "all",
    name: "All Products"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  // 3. Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("shopnest_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // 4. Modal / Drawer UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch data from Node.js Express REST API
  const fetchCatalogData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Parallel fetch for categories and products
      const [categoriesRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/products`)
      ]);

      if (!categoriesRes.ok || !productsRes.ok) {
        throw new Error(`API responded with status ${categoriesRes.status || productsRes.status}`);
      }

      const categoriesJson = await categoriesRes.json();
      const productsJson = await productsRes.json();

      if (categoriesJson.data && categoriesJson.data.length > 0) {
        setCategories(categoriesJson.data);
      }
      if (productsJson.data && productsJson.data.length > 0) {
        setProducts(productsJson.data);
      }

      // Check whether data came from MongoDB or server fallback
      const source = productsJson.source === "mongodb" ? "mongodb" : "express-api";
      setApiSource(source);
    } catch (err) {
      console.warn("Could not reach Express backend, using local dataset fallback:", err.message);
      setApiError("Backend REST API offline. Serving local catalog fallback.");
      setApiSource("local-fallback");
      // Use local data fallback
      setCategories(CATEGORIES_DATA);
      setProducts(PRODUCTS_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem("shopnest_cart", JSON.stringify(cart));
  }, [cart]);

  // Add product to cart handler
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Show temporary toast notification
    setToastMessage(`Added "${product.name}" to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Clear all items in cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Compute total item count for header badge
  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Compute filtered & sorted product list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Hierarchical Category Filtering
    if (selectedCategory.type === "category") {
      result = result.filter((p) => p.category === selectedCategory.id);
    } else if (selectedCategory.type === "subcategory") {
      result = result.filter((p) => p.subCategory === selectedCategory.id);
    } else if (selectedCategory.type === "leaf") {
      result = result.filter((p) => p.leafCategory === selectedCategory.id);
    }

    // 2. Keyword Search Filtering
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // 3. Price Bracket Filtering
    if (priceRange === "under-5000") {
      result = result.filter((p) => p.price < 5000);
    } else if (priceRange === "5000-15000") {
      result = result.filter((p) => p.price >= 5000 && p.price <= 15000);
    } else if (priceRange === "above-15000") {
      result = result.filter((p) => p.price > 15000);
    }

    // 4. Sorting logic
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  return (
    <div className="app-layout">
      {/* 1. Global Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <aside className="toast-notification" role="status" aria-live="polite">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </aside>
      )}

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 2. Main Layout Container: Hierarchical Sidebar + Catalog Content */}
      <main className="main-content-area">
        {/* Left Column: Hierarchical Category Tree (HTML nested <ul>/<li> lists) */}
        <CategoryTree
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Right Column: Filter Bar & Product Catalog Grid */}
        <section className="catalog-section" aria-label="Product Catalog">
          {/* API Error Notification with Retry option */}
          {apiError && (
            <div className="api-error-banner" role="alert">
              <div className="api-error-content">
                <AlertCircle size={18} />
                <span>{apiError}</span>
              </div>
              <button className="retry-api-btn" onClick={fetchCatalogData}>
                <RefreshCw size={13} style={{ marginRight: 4 }} />
                Retry API
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            productCount={filteredProducts.length}
          />

          {/* Catalog State: Loading / Empty / Product Grid */}
          {isLoading ? (
            <div className="loading-products-grid" aria-live="polite">
              <div className="loading-spinner" />
              <p className="loading-text">Loading catalog from Express REST API...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="no-products-found">
              <AlertCircle size={44} className="no-products-icon" />
              <h3>No products match your criteria</h3>
              <p>
                Try selecting another category from the hierarchical list, clearing your search query, or resetting the price filter.
              </p>
              <button
                className="reset-all-filters-btn"
                onClick={() => {
                  setSelectedCategory({ type: "all", id: "all", name: "All Products" });
                  setSearchQuery("");
                  setPriceRange("all");
                  setSortBy("featured");
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* 3. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 4. College Project Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="footer-brand">
              <ShoppingBag size={20} />
              <span>ShopNest Online Shopping</span>
            </div>
            <p className="footer-desc">
              TW-3 Full Stack Web Development Project: Structured categorization and navigation for high-volume catalogs using semantic hierarchical HTML lists.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Implemented Features</h4>
            <ul className="footer-list">
              <li>Hierarchical HTML Lists (&lt;ul&gt;, &lt;li&gt;)</li>
              <li>Node.js & Express REST API (`/api/categories`, `/api/products`)</li>
              <li>Multi-level Category & Subcategory Filtering</li>
              <li>Live Search & Dynamic Price Sorting</li>
              <li>Interactive Cart with Quantity Management</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Backend & Database</h4>
            <div className="tech-badges">
              <span className="tech-badge">Node.js Express</span>
              <span className="tech-badge">MongoDB / Mongoose</span>
              <span className="tech-badge">REST API</span>
              <span className="tech-badge">React 19</span>
              <span className="tech-badge">Vite</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} College TW-3 Web Development Laboratory | Ready for Evaluation</p>
        </div>
      </footer>
    </div>
  );
}
