/**
 * Main Application Component
 * ==========================
 * This is the root component of the Mobile Shop application.
 * It sets up:
 * - React Router for navigation
 * - Context providers (Auth, Cart)
 * - Protected routes for admin and user areas
 * - ToastContainer for notifications
 * 
 * Project Structure:
 * - /src/firebase - Firebase configuration
 * - /src/contexts - React Context providers (Auth, Cart)
 * - /src/services - Firebase service functions (Products, Orders, Services, Users)
 * - /src/components/common - Reusable components (Navbar, Footer, ProductCard, etc.)
 * - /src/components/admin - Admin-specific components
 * - /src/pages/user - User-facing pages (Home, Products, Cart, etc.)
 * - /src/pages/admin - Admin panel pages (Dashboard, Products, Orders, etc.)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute, { PublicRoute } from './components/common/ProtectedRoute';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Products from './pages/user/Products';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Services from './pages/user/Services';
import MyOrders from './pages/user/MyOrders';

// Admin Components and Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';

// Styles
import './App.css';

/**
 * UserLayout Component
 * Wrapper for user-facing pages with Navbar and Footer
 */
const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      {/* Auth Provider wraps entire app for authentication state */}
      <AuthProvider>
        {/* Cart Provider for shopping cart functionality */}
        <CartProvider>
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}

            {/* Home Page */}
            <Route path="/" element={
              <UserLayout>
                <Home />
              </UserLayout>
            } />

            {/* Products List */}
            <Route path="/products" element={
              <UserLayout>
                <Products />
              </UserLayout>
            } />

            {/* Product Detail */}
            <Route path="/products/:id" element={
              <UserLayout>
                <ProductDetail />
              </UserLayout>
            } />

            {/* Services Page */}
            <Route path="/services" element={
              <UserLayout>
                <Services />
              </UserLayout>
            } />

            {/* ==================== AUTH ROUTES ==================== */}

            {/* Login - Only accessible when not logged in */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Register - Only accessible when not logged in */}
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* ==================== PROTECTED USER ROUTES ==================== */}

            {/* Cart - Requires login */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <UserLayout>
                  <Cart />
                </UserLayout>
              </ProtectedRoute>
            } />

            {/* My Orders - Requires login */}
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <UserLayout>
                  <MyOrders />
                </UserLayout>
              </ProtectedRoute>
            } />

            {/* My Services - Requires login */}
            <Route path="/my-services" element={
              <ProtectedRoute>
                <UserLayout>
                  <MyOrders />
                </UserLayout>
              </ProtectedRoute>
            } />

            {/* ==================== ADMIN ROUTES ==================== */}

            {/* Admin Panel - Requires admin role */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              {/* Admin Dashboard */}
              <Route index element={<AdminDashboard />} />

              {/* Products Management */}
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />

              {/* Orders Management */}
              <Route path="orders" element={<AdminOrders />} />

              {/* Service Requests Management */}
              <Route path="services" element={<AdminServices />} />

              {/* Users Management */}
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* ==================== 404 NOT FOUND ==================== */}
            <Route path="*" element={
              <UserLayout>
                <div className="not-found-page">
                  <h1>404</h1>
                  <p>Page not found</p>
                </div>
              </UserLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
