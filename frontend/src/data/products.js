// sample product catalog and category hierarchy for TW-3 Web Development Project
// Problem Statement: Structured categorization for efficient browsing using hierarchical HTML lists.

export const CATEGORIES_DATA = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "Tv",
    subcategories: [
      {
        id: "audio",
        name: "Audio Devices",
        subcategories: [
          { id: "headphones", name: "Over-Ear Headphones" },
          { id: "earbuds", name: "Wireless Earbuds" },
          { id: "speakers", name: "Bluetooth Speakers" }
        ]
      },
      {
        id: "computers",
        name: "Computers & Gear",
        subcategories: [
          { id: "laptops", name: "Laptops & Notebooks" },
          { id: "accessories", name: "Keyboards & Mice" }
        ]
      },
      {
        id: "wearables",
        name: "Smart Wearables",
        subcategories: [
          { id: "smartwatches", name: "Smartwatches & Bands" }
        ]
      }
    ]
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: "Shirt",
    subcategories: [
      {
        id: "mens-wear",
        name: "Men's Collection",
        subcategories: [
          { id: "mens-jackets", name: "Jackets & Hoodies" },
          { id: "mens-shirts", name: "Casual Shirts" }
        ]
      },
      {
        id: "womens-wear",
        name: "Women's Collection",
        subcategories: [
          { id: "womens-dresses", name: "Dresses & Tops" },
          { id: "womens-bags", name: "Handbags & Totes" }
        ]
      },
      {
        id: "footwear",
        name: "Footwear",
        subcategories: [
          { id: "sneakers", name: "Sport Sneakers" }
        ]
      }
    ]
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: "Home",
    subcategories: [
      {
        id: "furniture",
        name: "Modern Furniture",
        subcategories: [
          { id: "chairs", name: "Ergonomic Chairs" },
          { id: "desks", name: "Standing Desks" }
        ]
      },
      {
        id: "lighting",
        name: "Lighting & Decor",
        subcategories: [
          { id: "desk-lamps", name: "LED Desk Lamps" }
        ]
      }
    ]
  }
];

export const PRODUCTS_DATA = [
  {
    id: 1,
    name: "AuraPro Wireless Noise Cancelling Headphones",
    category: "electronics",
    subCategory: "audio",
    leafCategory: "headphones",
    price: 12999,
    originalPrice: 16999,
    rating: 4.8,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    badge: "Bestseller",
    description: "Active Noise Cancellation with 40-hour battery life and spatial audio immersion.",
    inStock: true
  },
  {
    id: 2,
    name: "SonicBuds True Wireless Earbuds",
    category: "electronics",
    subCategory: "audio",
    leafCategory: "earbuds",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviews: 185,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    badge: "Hot Deal",
    description: "Crystal-clear calls, IPX5 water resistance, and fast charging case.",
    inStock: true
  },
  {
    id: 3,
    name: "PulseWave 360 Portable Bluetooth Speaker",
    category: "electronics",
    subCategory: "audio",
    leafCategory: "speakers",
    price: 4999,
    originalPrice: 6499,
    rating: 4.5,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    badge: "Popular",
    description: "Deep bass, IP67 waterproof design with vibrant LED illumination.",
    inStock: true
  },
  {
    id: 4,
    name: "Zenith Ultra Slim 15-inch Laptop",
    category: "electronics",
    subCategory: "computers",
    leafCategory: "laptops",
    price: 64999,
    originalPrice: 74999,
    rating: 4.9,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    badge: "Top Rated",
    description: "Intel Core i7 13th Gen, 16GB RAM, 1TB NVMe SSD with 2.8K OLED screen.",
    inStock: true
  },
  {
    id: 5,
    name: "MechType RGB Wireless Mechanical Keyboard",
    category: "electronics",
    subCategory: "computers",
    leafCategory: "accessories",
    price: 5499,
    originalPrice: 6999,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    badge: "Gamer Choice",
    description: "Hot-swappable tactile switches, multi-device Bluetooth, and per-key RGB.",
    inStock: true
  },
  {
    id: 6,
    name: "Vantage Precision Ergonomic Mouse",
    category: "electronics",
    subCategory: "computers",
    leafCategory: "accessories",
    price: 2799,
    originalPrice: 3599,
    rating: 4.6,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    badge: "Ergonomic",
    description: "Sculpted thumb rest, whisper-quiet clicks, and 4000 DPI sensor.",
    inStock: true
  },
  {
    id: 7,
    name: "Chronos Apex AMOLED Smartwatch",
    category: "electronics",
    subCategory: "wearables",
    leafCategory: "smartwatches",
    price: 8999,
    originalPrice: 11999,
    rating: 4.7,
    reviews: 240,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    badge: "Trending",
    description: "Always-on AMOLED display, heart-rate & SpO2 tracking, and 7-day battery life.",
    inStock: true
  },
  {
    id: 8,
    name: "Urban Explorer Windbreaker Jacket",
    category: "fashion",
    subCategory: "mens-wear",
    leafCategory: "mens-jackets",
    price: 3299,
    originalPrice: 4499,
    rating: 4.5,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    badge: "Winter Pick",
    description: "Water-repellent technical fabric with breathable lining and concealable hood.",
    inStock: true
  },
  {
    id: 9,
    name: "Heritage Oxford Cotton Casual Shirt",
    category: "fashion",
    subCategory: "mens-wear",
    leafCategory: "mens-shirts",
    price: 1899,
    originalPrice: 2499,
    rating: 4.4,
    reviews: 140,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    badge: "Classic",
    description: "100% pre-shrunk organic cotton with button-down collar and relaxed fit.",
    inStock: true
  },
  {
    id: 10,
    name: "Elysian Floral Maxi Summer Dress",
    category: "fashion",
    subCategory: "womens-wear",
    leafCategory: "womens-dresses",
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
    badge: "New Arrival",
    description: "Flowing silhouette with delicate botanic prints and tiered ruffled hem.",
    inStock: true
  },
  {
    id: 11,
    name: "Milan Minimalist Leather Tote Handbag",
    category: "fashion",
    subCategory: "womens-wear",
    leafCategory: "womens-bags",
    price: 4599,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 160,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    badge: "Luxury",
    description: "Full-grain vegan leather with magnetic closure and padded laptop divider.",
    inStock: true
  },
  {
    id: 12,
    name: "CloudStrider Responsive Running Sneakers",
    category: "fashion",
    subCategory: "footwear",
    leafCategory: "sneakers",
    price: 5299,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 290,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    badge: "Bestseller",
    description: "Engineered mesh upper with responsive foam cushioning for all-day comfort.",
    inStock: true
  },
  {
    id: 13,
    name: "ErgoSpine Lumbar Mesh Office Chair",
    category: "home-living",
    subCategory: "furniture",
    leafCategory: "chairs",
    price: 11499,
    originalPrice: 14999,
    rating: 4.8,
    reviews: 118,
    image: "https://images.unsplash.com/photo-1580481077195-c2669e2c6085?w=600&auto=format&fit=crop&q=80",
    badge: "Work From Home",
    description: "Adjustable 3D armrests, dynamic lumbar support, and breathable Korean mesh.",
    inStock: true
  },
  {
    id: 14,
    name: "Solid Oak Height-Adjustable Standing Desk",
    category: "home-living",
    subCategory: "furniture",
    leafCategory: "desks",
    price: 24999,
    originalPrice: 29999,
    rating: 4.9,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
    badge: "Premium",
    description: "Dual-motor electric lift system with 4 memory presets and cable management tray.",
    inStock: true
  },
  {
    id: 15,
    name: "Lumina Minimalist Touch Sensor Desk Lamp",
    category: "home-living",
    subCategory: "lighting",
    leafCategory: "desk-lamps",
    price: 2199,
    originalPrice: 2899,
    rating: 4.6,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    badge: "Eco-Friendly",
    description: "Flicker-free eye protection LED, 5 color temperature modes, and wireless charging pad.",
    inStock: true
  }
];
