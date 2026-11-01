import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Tv,
  Shirt,
  Home,
  RotateCcw,
  Sparkles
} from "lucide-react";

/**
 * CategoryTree Component
 * 
 * College Lab Requirement Fulfillment:
 * Organizes product categories and subcategories strictly using hierarchical HTML lists (<nav>, <ul>, <li>).
 * Features:
 * - Nested <ul> and <li> for Category -> Subcategory -> Leaf Category
 * - Expandable / collapsible tree nodes with animated carets
 * - Dynamic product counts calculated per category/subcategory
 * - Active state highlighting for student demonstration
 */
export default function CategoryTree({
  categories,
  products,
  selectedCategory,
  setSelectedCategory,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) {
  // State to track which categories and subcategories are expanded
  // Initialized with all top-level categories expanded for quick visibility
  const [expandedNodes, setExpandedNodes] = useState({
    electronics: true,
    audio: true,
    computers: true,
    fashion: true,
    "home-living": true
  });

  // Toggle expansion of a tree node
  const toggleNode = (nodeId, e) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Helper function to count products in any category level
  const getProductCount = (type, id) => {
    if (type === "all") return products.length;
    if (type === "category") return products.filter((p) => p.category === id).length;
    if (type === "subcategory") return products.filter((p) => p.subCategory === id).length;
    if (type === "leaf") return products.filter((p) => p.leafCategory === id).length;
    return 0;
  };

  // Icon mapping for top-level categories
  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Tv":
        return <Tv size={17} className="cat-icon" />;
      case "Shirt":
        return <Shirt size={17} className="cat-icon" />;
      case "Home":
        return <Home size={17} className="cat-icon" />;
      default:
        return <Layers size={17} className="cat-icon" />;
    }
  };

  const handleSelect = (filterObj) => {
    setSelectedCategory(filterObj);
    // Close sidebar on mobile after choosing
    if (window.innerWidth < 900) {
      setIsMobileSidebarOpen(false);
    }
  };

  const isSelected = (type, id) => {
    return selectedCategory.type === type && selectedCategory.id === id;
  };

  return (
    <aside className={`category-sidebar ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-title-group">
          <Layers className="sidebar-icon" size={20} />
          <h2 className="sidebar-title">Categories</h2>
        </div>
        <button
          className="reset-filter-btn"
          onClick={() => handleSelect({ type: "all", id: "all", name: "All Products" })}
          title="Reset category filters"
          aria-label="Reset all category filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <p className="sidebar-note">
        Structured hierarchical list for catalog navigation.
      </p>

      {/* Primary Semantic Hierarchical HTML List (<nav> > <ul> > <li>) */}
      <nav className="category-nav-tree" aria-label="Hierarchical Product Categories">
        <ul className="hierarchical-list root-category-list">
          {/* Virtual Root: All Products */}
          <li className="category-item">
            <div
              className={`category-row ${isSelected("all", "all") ? "active" : ""}`}
              onClick={() => handleSelect({ type: "all", id: "all", name: "All Products" })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSelect({ type: "all", id: "all", name: "All Products" })}
            >
              <div className="row-content">
                <Sparkles size={16} className="all-icon" />
                <span className="category-name">All Products</span>
              </div>
              <span className="count-badge">{getProductCount("all")}</span>
            </div>
          </li>

          {/* Hierarchical Categories from Data */}
          {categories.map((cat) => {
            const isCatExpanded = !!expandedNodes[cat.id];
            const isCatActive = isSelected("category", cat.id);
            const catCount = getProductCount("category", cat.id);

            return (
              <li key={cat.id} className="category-item">
                {/* Level 1: Main Category Header */}
                <div
                  className={`category-row level-1 ${isCatActive ? "active" : ""}`}
                  onClick={() => handleSelect({ type: "category", id: cat.id, name: cat.name })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect({ type: "category", id: cat.id, name: cat.name })}
                >
                  <div className="row-content">
                    {/* Toggle expand/collapse arrow */}
                    <button
                      className="expand-btn"
                      onClick={(e) => toggleNode(cat.id, e)}
                      aria-label={`${isCatExpanded ? "Collapse" : "Expand"} ${cat.name}`}
                      title={`${isCatExpanded ? "Collapse" : "Expand"} ${cat.name}`}
                    >
                      {isCatExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {renderCategoryIcon(cat.icon)}
                    <span className="category-name">{cat.name}</span>
                  </div>
                  <span className="count-badge">{catCount}</span>
                </div>

                {/* Level 2: Nested Subcategory HTML List */}
                {isCatExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="hierarchical-list subcategory-list">
                    {cat.subcategories.map((sub) => {
                      const isSubExpanded = !!expandedNodes[sub.id];
                      const isSubActive = isSelected("subcategory", sub.id);
                      const subCount = getProductCount("subcategory", sub.id);

                      return (
                        <li key={sub.id} className="subcategory-item">
                          {/* Level 2 Row */}
                          <div
                            className={`category-row level-2 ${isSubActive ? "active" : ""}`}
                            onClick={() =>
                              handleSelect({
                                type: "subcategory",
                                id: sub.id,
                                name: sub.name,
                                parentName: cat.name
                              })
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSelect({
                                type: "subcategory",
                                id: sub.id,
                                name: sub.name,
                                parentName: cat.name
                              })
                            }
                          >
                            <div className="row-content">
                              {sub.subcategories && sub.subcategories.length > 0 ? (
                                <button
                                  className="expand-btn sub-expand-btn"
                                  onClick={(e) => toggleNode(sub.id, e)}
                                  aria-label={`${isSubExpanded ? "Collapse" : "Expand"} ${sub.name}`}
                                >
                                  {isSubExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                              ) : (
                                <span className="list-bullet">•</span>
                              )}
                              <span className="subcategory-name">{sub.name}</span>
                            </div>
                            <span className="count-badge sub-badge">{subCount}</span>
                          </div>

                          {/* Level 3: Nested Leaf Subcategory HTML List */}
                          {isSubExpanded && sub.subcategories && sub.subcategories.length > 0 && (
                            <ul className="hierarchical-list leaf-category-list">
                              {sub.subcategories.map((leaf) => {
                                const isLeafActive = isSelected("leaf", leaf.id);
                                const leafCount = getProductCount("leaf", leaf.id);

                                return (
                                  <li key={leaf.id} className="leaf-category-item">
                                    <div
                                      className={`category-row level-3 ${isLeafActive ? "active" : ""}`}
                                      onClick={() =>
                                        handleSelect({
                                          type: "leaf",
                                          id: leaf.id,
                                          name: leaf.name,
                                          parentName: `${cat.name} / ${sub.name}`
                                        })
                                      }
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        handleSelect({
                                          type: "leaf",
                                          id: leaf.id,
                                          name: leaf.name,
                                          parentName: `${cat.name} / ${sub.name}`
                                        })
                                      }
                                    >
                                      <div className="row-content">
                                        <span className="leaf-bullet">-</span>
                                        <span className="leaf-name">{leaf.name}</span>
                                      </div>
                                      <span className="count-badge leaf-badge">{leafCount}</span>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
