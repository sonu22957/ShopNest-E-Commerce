# 🛍️ ShopNest – MERN Stack E-Commerce Platform

<p align="center">
  <b>A Full-Stack E-Commerce Web Application built with the MERN Stack</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-orange?style=for-the-badge" />
</p>

---

## 📌 About The Project

**ShopNest** is a modern full-stack E-Commerce web application developed using the **MERN Stack**.

The application provides a complete online shopping experience where users can browse products, view product details, manage their shopping cart, place orders, and manage their accounts.

The project also includes an **Admin Dashboard** that allows administrators to manage products, users, orders, prices, stock, and product images.

This project was developed to understand and implement real-world concepts such as **REST APIs, JWT Authentication, Role-Based Authorization, MongoDB Database Management, Image Uploading, and React State Management**.

---

# ✨ Features

## 👤 User Features

- 🔐 User Registration & Login
- 🔑 JWT-based Authentication
- 👤 User Profile Management
- 🛍️ Browse Products
- 🔎 Search Products
- 📂 Product Categories
- 📄 View Product Details
- 🛒 Add Products to Cart
- ➕ Increase/Decrease Product Quantity
- ❌ Remove Products from Cart
- 💰 Automatic Cart Total Calculation
- 📦 Place Orders
- 📋 View Order History
- 📱 Responsive User Interface

---

## 👨‍💼 Admin Features

- 🔐 Secure Admin Authentication
- 📊 Admin Dashboard
- 📦 Add New Products
- ✏️ Update Products
- 🗑️ Delete Products
- 🖼️ Upload Product Images
- ☁️ Cloudinary Image Storage
- 📊 Manage Product Stock
- 💰 Manage Product Prices
- 👥 Manage Users
- 📋 Manage Orders
- 📈 View Store Statistics

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router DOM
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

## Backend

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- Multer

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## Image Management

- Cloudinary
- Multer

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- MongoDB Compass

---

# 🏗️ Project Architecture

```text
                    ┌───────────────────┐
                    │     React.js      │
                    │     Frontend      │
                    └─────────┬─────────┘
                              │
                              │ REST API
                              ▼
                    ┌───────────────────┐
                    │    Express.js     │
                    │      Backend      │
                    └─────────┬─────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        ┌───────────────┐           ┌────────────────┐
        │    MongoDB    │           │   Cloudinary   │
        │   Database    │           │ Image Storage  │
        └───────────────┘           └────────────────┘