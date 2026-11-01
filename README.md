# Online Shopping Category Page (TW-3 Full Stack Web Development)

A modern, responsive, full-stack MERN e-commerce category website built for college laboratory evaluation.

---

## 📌 Problem Statement & Objective
> **Problem Statement:** Large numbers of products require structured categorization for efficient browsing. The system should organize products and subcategories using hierarchical HTML lists.

This project organizes a rich product catalog using semantic, accessible, 3-level hierarchical HTML lists (`<nav>`, `<ul>`, `<li>`):
1. **Level 1 (Category):** Electronics, Fashion & Apparel, Home & Living
2. **Level 2 (Subcategory):** Audio Devices, Computers & Gear, Men's Collection, etc.
3. **Level 3 (Leaf Category):** Over-Ear Headphones, Wireless Earbuds, Running Sneakers, etc.

---

## 🏗️ Architecture Overview

```text
OnlineShopping/
├── frontend/                  <-- React.js SPA (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         (Brand title, search bar, cart badge)
│   │   │   ├── CategoryTree.jsx   (Semantic Hierarchical HTML <ul>/<li> Tree)
│   │   │   ├── ProductCard.jsx    (Card with price, discount, ratings, Add-to-Cart)
│   │   │   ├── FilterBar.jsx      (Active filter breadcrumbs, price chips, sort)
│   │   │   └── CartDrawer.jsx     (Slide-out cart, quantity adjust, 18% GST, checkout)
│   │   ├── data/
│   │   │   └── products.js        (Fallback client dataset)
│   │   ├── App.jsx                (State management & REST API fetch integration)
│   │   ├── App.css                (Modern, responsive design tokens & styling)
│   │   └── main.jsx               (React entry point)
│   ├── index.html
│   └── package.json
│
└── server/                    <-- Node.js & Express.js REST API
    ├── data/
    │   └── initialData.js         (Catalog dataset for seeding and fallback)
    ├── models/
    │   ├── Category.js            (Mongoose 3-level hierarchical category schema)
    │   └── Product.js             (Mongoose product schema with indexation)
    ├── seed.js                    (Database seeder script)
    ├── server.js                  (Express REST server with MongoDB connection)
    ├── .env.example               (Environment variables template)
    ├── .env                       (Active environment config)
    └── package.json
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js**: `v18+` (Tested on `v22.15.1`)
- **npm**: `v9+` (Tested on `10.9.2`)
- **MongoDB**: Local MongoDB community server (port `27017`) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

---

### Step 1: Start the Backend Server (Express & MongoDB)

1. Open a new terminal and navigate to the `server` directory:
   ```powershell
   cd server
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Configure your MongoDB connection in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/online_shopping_tw3
   ```
   *(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

4. Seed the database with initial categories and products:
   ```powershell
   npm run seed
   ```

5. Start the backend REST API:
   ```powershell
   npm start
   # Or for development with live reload:
   npm run dev
   ```
   *The server runs at: `http://localhost:5000`*

---

### Step 2: Start the Frontend Application (React & Vite)

1. Open a second terminal and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173/
   ```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns service status and database connectivity. |
| `GET` | `/api/categories` | Returns the 3-level hierarchical category tree. |
| `GET` | `/api/products` | Returns all products with optional filters: `?category=...&subCategory=...&leafCategory=...&search=...&sortBy=...&priceRange=...` |
| `GET` | `/api/products/:id` | Returns details for a single product by ID. |

---

## 🌐 Production Deployment Guide

This project is configured to deploy with zero hassle on free cloud hosting platforms:

### Option 1: Render (Recommended - Unified Full-Stack Service)
Deploy both the React frontend and Express backend together under a single URL on Render's free tier.

1. Push this project to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Blueprint**.
3. Select your GitHub repository. Render will automatically read `render.yaml`.
4. Under Environment Variables, set your `MONGODB_URI` (from MongoDB Atlas).
5. Click **Apply**. Render will install dependencies, build the Vite frontend, and launch the Express server serving both the API and client application.

---

### Option 2: Vercel (Frontend) + Render (Backend API)
If you prefer hosting the React client on Vercel's Edge CDN:

1. **Deploy Backend on Render**:
   - Create a **New Web Service** pointing to your repo.
   - Root directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variable: `MONGODB_URI=<your_atlas_connection_string>`
   - Copy your deployed backend URL (e.g. `https://my-backend.onrender.com`).

2. **Deploy Frontend on Vercel**:
   - Go to [Vercel](https://vercel.com) and import the repository.
   - Set Root Directory to `frontend`.
   - Framework preset: `Vite`.
   - Under **Environment Variables**, add:
     - Key: `VITE_API_URL`
     - Value: `https://my-backend.onrender.com/api`
   - Click **Deploy**.

---

### Option 3: Docker Container (Railway / Fly.io / AWS / Cloud Run)
A production multi-stage `Dockerfile` is included in the project root:
```bash
docker build -t online-shopping-tw3 .
docker run -p 5000:5000 -e MONGODB_URI="your_mongodb_atlas_uri" online-shopping-tw3
```

---

## ✨ Features Implemented for Evaluation

1. **Hierarchical HTML Lists**: Strict implementation of nested `<ul>` and `<li>` elements in `CategoryTree.jsx` as required by the problem statement.
2. **Category & Subcategory Filtering**: Dynamic filtering for any level in the hierarchy (All, Main category, Subcategory, or Leaf).
3. **Live Product Search**: Instant client and server keyword search across title, description, and tags.
4. **Price Sorting & Range Filtering**: Featured, Low to High, High to Low, Rating, and quick price bracket chips.
5. **Interactive Shopping Cart**: Quantity increment/decrement, remove item, subtotal, 18% GST calculation, free shipping qualification indicator, and checkout flow.
6. **Graceful Error Handling & Fallbacks**: If MongoDB or Express is temporarily offline, the frontend handles errors gracefully with a notification and fallback catalog.
7. **Responsive Design**: Off-canvas sliding sidebar on mobile devices, adaptive CSS grid, and touch-friendly controls.
