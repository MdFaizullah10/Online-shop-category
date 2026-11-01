import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "./data/initialData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or platform environment
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online_shopping_tw3";

// Middlewares
app.use(cors());
app.use(express.json());

// Track MongoDB connection state
let isDbConnected = false;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 4000 // Quick timeout to prevent server hanging if MongoDB isn't active
  })
  .then(() => {
    isDbConnected = true;
    console.log("--------------------------------------------------");
    console.log("✅ Successfully connected to MongoDB Database");
    console.log("--------------------------------------------------");
  })
  .catch((err) => {
    isDbConnected = false;
    console.warn("--------------------------------------------------");
    console.warn("⚠️  MongoDB is not available at:", MONGODB_URI);
    console.warn("⚠️  Error details:", err.message);
    console.warn("ℹ️  The REST API will serve initial catalog data as fallback.");
    console.warn("ℹ️  To connect real MongoDB: start mongod or provide a MongoDB Atlas URI in server/.env");
    console.warn("--------------------------------------------------");
  });

// Handle connection events
mongoose.connection.on("connected", () => {
  isDbConnected = true;
});
mongoose.connection.on("disconnected", () => {
  isDbConnected = false;
});

/* ==========================================================================
   REST API Endpoints
   ========================================================================== */

/**
 * Health Check API
 * GET /api/health
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ShopNest Online Shopping REST API",
    database: isDbConnected ? "connected" : "disconnected",
    uptime: process.uptime()
  });
});

/**
 * 1. GET /api/categories
 * Returns the hierarchical category tree for the sidebar navigation.
 */
app.get("/api/categories", async (req, res, next) => {
  try {
    if (isDbConnected) {
      const categoriesFromDb = await Category.find({}, { _id: 0, __v: 0 }).lean();
      if (categoriesFromDb && categoriesFromDb.length > 0) {
        return res.json({
          source: "mongodb",
          count: categoriesFromDb.length,
          data: categoriesFromDb
        });
      }
    }

    // Fallback if DB is disconnected or not yet seeded
    return res.json({
      source: "fallback",
      count: CATEGORIES_DATA.length,
      data: CATEGORIES_DATA
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 2. GET /api/products
 * Returns product catalog with optional filtering and sorting query parameters:
 * ?category=...&subCategory=...&leafCategory=...&search=...&sortBy=...
 */
app.get("/api/products", async (req, res, next) => {
  try {
    const { category, subCategory, leafCategory, search, sortBy, priceRange } = req.query;

    let productsList = [];

    if (isDbConnected) {
      // Build MongoDB query filter
      const queryFilter = {};
      if (category && category !== "all") queryFilter.category = category;
      if (subCategory) queryFilter.subCategory = subCategory;
      if (leafCategory) queryFilter.leafCategory = leafCategory;

      if (priceRange === "under-5000") queryFilter.price = { $lt: 5000 };
      else if (priceRange === "5000-15000") queryFilter.price = { $gte: 5000, $lte: 15000 };
      else if (priceRange === "above-15000") queryFilter.price = { $gt: 15000 };

      if (search && search.trim() !== "") {
        const regex = new RegExp(search.trim(), "i");
        queryFilter.$or = [
          { name: regex },
          { description: regex },
          { category: regex },
          { subCategory: regex },
          { leafCategory: regex },
          { badge: regex }
        ];
      }

      // Build sorting option
      let sortOption = {};
      if (sortBy === "price-asc") sortOption = { price: 1 };
      else if (sortBy === "price-desc") sortOption = { price: -1 };
      else if (sortBy === "rating-desc") sortOption = { rating: -1 };
      else if (sortBy === "name-asc") sortOption = { name: 1 };

      const dbProducts = await Product.find(queryFilter, { _id: 0, __v: 0 })
        .sort(sortOption)
        .lean();

      if (dbProducts && dbProducts.length > 0) {
        return res.json({
          source: "mongodb",
          count: dbProducts.length,
          data: dbProducts
        });
      }
    }

    // Fallback in-memory filtering when database is not connected
    productsList = [...PRODUCTS_DATA];

    if (category && category !== "all") {
      productsList = productsList.filter((p) => p.category === category);
    }
    if (subCategory) {
      productsList = productsList.filter((p) => p.subCategory === subCategory);
    }
    if (leafCategory) {
      productsList = productsList.filter((p) => p.leafCategory === leafCategory);
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      productsList = productsList.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    if (priceRange === "under-5000") {
      productsList = productsList.filter((p) => p.price < 5000);
    } else if (priceRange === "5000-15000") {
      productsList = productsList.filter((p) => p.price >= 5000 && p.price <= 15000);
    } else if (priceRange === "above-15000") {
      productsList = productsList.filter((p) => p.price > 15000);
    }

    if (sortBy === "price-asc") productsList.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") productsList.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating-desc") productsList.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "name-asc") productsList.sort((a, b) => a.name.localeCompare(b.name));

    return res.json({
      source: "fallback",
      count: productsList.length,
      data: productsList
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 3. GET /api/products/:id
 * Returns a single product by numeric id
 */
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    if (isDbConnected) {
      const product = await Product.findOne({ id: productId }, { _id: 0, __v: 0 }).lean();
      if (product) {
        return res.json({ source: "mongodb", data: product });
      }
    }

    const fallbackProduct = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!fallbackProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ source: "fallback", data: fallbackProduct });
  } catch (err) {
    next(err);
  }
});

// Resolve directory paths for static asset serving in full-stack production
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  console.log(`📦 Serving frontend static build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // Serve index.html for any SPA route that is not an API route
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// 404 Route handler for unhandled API or missing routes
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Express REST API server running at http://localhost:${PORT}`);
  console.log(`📌 Category API: http://localhost:${PORT}/api/categories`);
  console.log(`📌 Products API: http://localhost:${PORT}/api/products`);
});
