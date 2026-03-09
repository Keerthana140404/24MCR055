/**
 * Admin Layout Component
 * ======================
 * Provides the sidebar navigation for admin panel.
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiPackage,
    FiShoppingCart,
    FiTool,
    FiUsers,
    FiLogOut,
    FiMenu,
    FiX,
    FiSmartphone
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
        { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
        { path: '/admin/services', icon: <FiTool />, label: 'Services' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/" className="admin-logo">
                        <FiSmartphone />
                        <span>Mohan</span>
                    </NavLink>
                    <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">{currentUser?.displayName?.charAt(0) || 'A'}</div>
                    <div className="user-info">
                        <span className="user-name">{currentUser?.displayName || 'Admin'}</span>
                        <span className="user-role">Administrator</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/" className="nav-item">
                        <FiSmartphone />
                        <span>View Store</span>
                    </NavLink>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
                        <FiMenu />
                    </button>
                    <span className="admin-badge">Admin Panel</span>
                </header>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>

            {/* Overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default AdminLayout;
