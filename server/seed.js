import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import { CATEGORIES_DATA, PRODUCTS_DATA } from "./data/initialData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/online_shopping_tw3";

async function seedDatabase() {
  console.log("--------------------------------------------------");
  console.log("🌱 Starting MongoDB Database Seeding...");
  console.log(`Connecting to: ${MONGODB_URI.replace(/:([^:@]{1,})@/, ":****@")}`);
  console.log("--------------------------------------------------");

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout quickly if MongoDB is offline
    });
    console.log("✅ Successfully connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing Categories and Products...");
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    console.log(`Inserting ${CATEGORIES_DATA.length} root categories (with nested subcategories)...`);
    const insertedCategories = await Category.insertMany(CATEGORIES_DATA);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert products
    console.log(`Inserting ${PRODUCTS_DATA.length} products...`);
    const insertedProducts = await Product.insertMany(PRODUCTS_DATA);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log("--------------------------------------------------");
    console.log("🎉 Database seeding completed successfully!");
    console.log("--------------------------------------------------");
  } catch (err) {
    console.error("❌ Seeding Error:");
    console.error(err.message);
    if (err.name === "MongooseServerSelectionError") {
      console.log("\n💡 TIP: Ensure your MongoDB server is running, or verify your MONGODB_URI in server/.env.");
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedDatabase();
