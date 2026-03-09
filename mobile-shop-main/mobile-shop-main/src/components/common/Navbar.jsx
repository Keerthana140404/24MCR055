/**
 * Navbar Component
 * ================
 * The main navigation component that appears on all pages.
 * It dynamically changes based on:
 * - User authentication status
 * - User role (admin vs regular user)
 * - Current page location
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Cart icon with item count
 * - User profile dropdown
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FiMenu,
    FiX,
    FiShoppingCart,
    FiUser,
    FiLogOut,
    FiSettings,
    FiHome,
    FiSmartphone,
    FiTool,
    FiPackage
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
    // State for mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // State for user dropdown toggle
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    // Get authentication and cart context
    const { currentUser, userRole, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();

    const navigate = useNavigate();
    const location = useLocation();

    // Handle user logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Toggle user dropdown
    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Close mobile menu when clicking a link
    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
    };

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={handleNavClick}>
                    <FiSmartphone className="logo-icon" />
                    <span>Mohan</span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/"
                        className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <FiHome className="nav-icon" />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/products"
                        className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <FiSmartphone className="nav-icon" />
                        <span>Products</span>
                    </Link>

                    <Link
                        to="/services"
                        className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        <FiTool className="nav-icon" />
                        <span>Services</span>
                    </Link>

                    {/* Show user-specific links if logged in */}
                    {currentUser && !isAdmin && (
                        <Link
                            to="/my-orders"
                            className={`navbar-link ${isActive('/my-orders') ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            <FiPackage className="nav-icon" />
                            <span>My Orders</span>
                        </Link>
                    )}

                    {/* Admin Panel Link (only visible to admins) */}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`navbar-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            <FiSettings className="nav-icon" />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    {/* Mobile-only auth buttons */}
                    <div className="mobile-auth-buttons">
                        {!currentUser ? (
                            <>
                                <Link to="/login" className="btn btn-outline" onClick={handleNavClick}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary" onClick={handleNavClick}>
                                    Register
                                </Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="btn btn-outline logout-btn">
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right side actions */}
                <div className="navbar-actions">
                    {/* Cart Icon (only for non-admin users) */}
                    {currentUser && !isAdmin && (
                        <Link to="/cart" className="navbar-cart">
                            <FiShoppingCart />
                            {getCartCount() > 0 && (
                                <span className="cart-badge">{getCartCount()}</span>
                            )}
                        </Link>
                    )}

                    {/* User Profile / Auth Buttons */}
                    {currentUser ? (
                        <div className="user-dropdown-container">
                            <button
                                className="user-avatar-btn"
                                onClick={toggleUserDropdown}
                            >
                                <FiUser />
                                <span className="user-name">{currentUser.displayName || 'User'}</span>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <p className="dropdown-email">{currentUser.email}</p>
                                        <p className="dropdown-role">{userRole}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={handleNavClick}
                                    >
                                        <FiUser />
                                        <span>Profile</span>
                                    </Link>
                                    {!isAdmin && (
                                        <Link
                                            to="/my-orders"
                                            className="dropdown-item"
                                            onClick={handleNavClick}
                                        >
                                            <FiPackage />
                                            <span>My Orders</span>
                                        </Link>
                                    )}
                                    <div className="dropdown-divider"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="dropdown-item logout-item"
                                    >
                                        <FiLogOut />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
            )}
        </nav>
    );
};

export default Navbar;
