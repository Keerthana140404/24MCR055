# MobileShop - Full-Stack Mobile Shop Website

A comprehensive full-stack mobile shop website for service and sales management built with React.js (frontend) and Firebase (backend). This project features two separate panels: **Admin Panel** and **User Panel** with role-based access control.

## 🚀 Live Demo

- **Local Development**: http://localhost:5173/
- Open the URL in your browser after running `npm run dev`

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Installation](#installation)
5. [Firebase Setup](#firebase-setup)
6. [Database Structure](#database-structure)
7. [User Flow](#user-flow)
8. [Admin Flow](#admin-flow)

## 🛠 Tech Stack

### Frontend
- **React.js** - Functional components with hooks
- **React Router v6** - Client-side routing
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **CSS3** - Custom styling with CSS variables

### Backend (Firebase)
- **Firebase Authentication** - Email & password authentication
- **Firebase Firestore** - NoSQL database for structured data
- **Firebase Storage** - Product image uploads
- **Firebase Analytics** - Usage tracking

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Shared components (Navbar, Footer, ProductCard)
│   └── admin/               # Admin layout and components
├── contexts/
│   ├── AuthContext.jsx      # Authentication state management
│   └── CartContext.jsx      # Shopping cart state management
├── firebase/
│   └── config.js            # Firebase configuration
├── pages/
│   ├── user/                # User pages (Home, Products, Cart, etc.)
│   └── admin/               # Admin pages (Dashboard, Orders, etc.)
├── services/                # Firebase service functions
├── App.jsx                  # Main app with routing
└── App.css                  # Global styles
```

## ✨ Features

### User Panel
- ✅ User registration and login
- ✅ Browse mobile products with filtering
- ✅ Add to cart and checkout
- ✅ Request mobile repair services
- ✅ View order history

### Admin Panel
- ✅ Admin-only access
- ✅ Add/Edit/Delete products with image upload
- ✅ Manage orders (update status)
- ✅ Manage service requests
- ✅ View all users
- ✅ Dashboard with analytics

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔥 Creating Admin User

1. Register a new user
2. Go to Firebase Console → Firestore
3. Find user in `users` collection
4. Change `role` from `user` to `admin`

## 📊 Database Collections

- **users** - User profiles with roles
- **products** - Mobile phone products
- **orders** - Customer orders
- **serviceRequests** - Repair service requests

## 👤 User Flow

1. Browse Products → Register/Login → Add to Cart → Checkout → Track Orders

## 🔐 Admin Flow

1. Login → Dashboard → Manage Products/Orders/Services/Users

---

**Built with ❤️ using React.js and Firebase**
