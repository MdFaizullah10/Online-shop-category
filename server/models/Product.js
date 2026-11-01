import mongoose from "mongoose";

/**
 * Product Schema
 * Represents catalog items associated with hierarchical categories
 */
const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true, index: true },
    leafCategory: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    badge: { type: String, trim: true },
    description: { type: String, trim: true },
    inStock: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Product", ProductSchema);
