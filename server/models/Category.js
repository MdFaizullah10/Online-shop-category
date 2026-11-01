import mongoose from "mongoose";

/**
 * Category Schema
 * Represents the 3-level hierarchical category tree:
 * Level 1: Category (e.g., Electronics)
 * Level 2: Subcategory (e.g., Audio Devices)
 * Level 3: Leaf Category (e.g., Over-Ear Headphones)
 */

// Level 3 Schema (Leaf category)
const LeafCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  { _id: false }
);

// Level 2 Schema (Subcategory)
const SubcategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    subcategories: [LeafCategorySchema]
  },
  { _id: false }
);

// Level 1 Schema (Root Category)
const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: "Layers" },
    subcategories: [SubcategorySchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
