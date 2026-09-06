const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./model/Product");
const connectDB = require("./config/db");

dotenv.config();

const products = [
  // ── Electronics ──
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling headphones with dual processors, 8 microphones, exceptional hands-free calling, and up to 30 hours battery life.",
    price: 24990,
    originalPrice: 29990,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    numReviews: 142,
    stock: 25,
    isFeatured: true
  },
  {
    name: "Apple iPhone 15 Pro (256GB - Natural Titanium)",
    description: "Forged in titanium with industry-leading A17 Pro chip, customizable Action button, 48MP main camera system, and next-generation portraits.",
    price: 129900,
    originalPrice: 139900,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    numReviews: 285,
    stock: 14,
    isFeatured: true
  },
  {
    name: "Logitech G Pro X Superlight Wireless Gaming Mouse",
    description: "Ultra-lightweight under 63 grams gaming mouse with HERO 25K sensor, zero-additive PTFE feet, and ultra-fast LIGHTSPEED wireless technology.",
    price: 9999,
    originalPrice: 13995,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    numReviews: 89,
    stock: 30,
    isFeatured: false
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    description: "Smarter, brighter, and mightier with the S9 SiP chip, double tap gesture interaction, brighter display, and advanced health & fitness tracking.",
    price: 41900,
    originalPrice: 44900,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    numReviews: 96,
    stock: 18,
    isFeatured: true
  },
  {
    name: "Keychron K2 Mechanical RGB Keyboard",
    description: "Compact 75% layout Bluetooth wireless mechanical keyboard with hot-swappable Gateron G Pro switches and Mac/Windows cross-compatibility.",
    price: 6999,
    originalPrice: 8999,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    numReviews: 54,
    stock: 22,
    isFeatured: false
  },
  {
    name: "Sony PlayStation 5 DualSense Wireless Controller",
    description: "Immersive haptic feedback, dynamic adaptive triggers, and a built-in microphone integrated into an iconic comfortable design.",
    price: 5490,
    originalPrice: 6390,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    numReviews: 178,
    stock: 40,
    isFeatured: false
  },

  // ── Footwear ──
  {
    name: "Nike Air Max Pulse Athletic Sneakers",
    description: "Drawing inspiration from London music scene, blending point-loaded Air cushioning with durable textile and leather accents.",
    price: 8495,
    originalPrice: 10995,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    numReviews: 110,
    stock: 28,
    isFeatured: true
  },
  {
    name: "Adidas Ultraboost Light Running Shoes",
    description: "Experience epic energy return with the lightest BOOST cushioning ever made, featuring Primeknit+ upper for a snug, sock-like fit.",
    price: 9999,
    originalPrice: 13999,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    numReviews: 73,
    stock: 19,
    isFeatured: false
  },
  {
    name: "Handcrafted Heritage Leather Chelsea Boots",
    description: "Full-grain genuine Italian leather upper with Goodyear welt construction, elastic side goring, and durable anti-slip rubber outsole.",
    price: 4999,
    originalPrice: 7499,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.5,
    numReviews: 36,
    stock: 15,
    isFeatured: false
  },

  // ── Clothing / Fashion ──
  {
    name: "Classic Minimalist Organic Cotton T-Shirt",
    description: "240 GSM heavy combed 100% organic cotton tee with pre-shrunk fabric, ribbed collar, and relaxed modern silhouette.",
    price: 999,
    originalPrice: 1599,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    numReviews: 92,
    stock: 50,
    isFeatured: true
  },
  {
    name: "Vintage Washed Oversized Denim Jacket",
    description: "Premium heavy denim jacket with distressed wash finish, dual chest flap pockets, brass shank buttons, and tailored relaxed fit.",
    price: 3299,
    originalPrice: 4999,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    numReviews: 64,
    stock: 20,
    isFeatured: false
  },
  {
    name: "Urban Streetwear Fleece Pullover Hoodie",
    description: "Ultra-plush brushed fleece lining, kangaroo front pocket, dropped shoulders, and double-layered drawstring hood.",
    price: 2199,
    originalPrice: 3299,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    numReviews: 48,
    stock: 35,
    isFeatured: false
  },

  // ── Home & Kitchen ──
  {
    name: "De'Longhi Barista Espresso & Cappuccino Maker",
    description: "15-bar professional pressure pump, manual milk frothing wand, dual thermostat controls, and stainless steel housing.",
    price: 14999,
    originalPrice: 19999,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    numReviews: 81,
    stock: 12,
    isFeatured: true
  },
  {
    name: "Aromatherapy Ultrasonic Essential Oil Diffuser",
    description: "500ml ultrasonic mist diffuser with 7 ambient LED color modes, auto shut-off safety protection, and whisper-quiet operation.",
    price: 1799,
    originalPrice: 2499,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.4,
    numReviews: 53,
    stock: 30,
    isFeatured: false
  },
  {
    name: "Insulated Stainless Steel Hydro Water Bottle (1 Litre)",
    description: "Triple-layer vacuum insulated 18/8 food-grade stainless steel bottle. Keeps cold for 24 hours and hot for 12 hours with sweat-free powder coat.",
    price: 1199,
    originalPrice: 1799,
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    numReviews: 125,
    stock: 45,
    isFeatured: false
  },

  // ── Accessories ──
  {
    name: "Ray-Ban Classic Polarized Wayfarer Sunglasses",
    description: "Timeless style with crystal polarized green G-15 lenses, 100% UV protection, and durable acetate frame.",
    price: 7590,
    originalPrice: 9990,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    numReviews: 67,
    stock: 22,
    isFeatured: true
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("Existing products removed from MongoDB.");
    
    // Insert modern products with real HD photos
    const inserted = await Product.insertMany(products);
    console.log(`Successfully seeded ${inserted.length} products to MongoDB!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
