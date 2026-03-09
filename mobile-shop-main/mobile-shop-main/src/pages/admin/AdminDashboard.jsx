/**
 * Admin Dashboard Component
 * =========================
 * Main dashboard for admin panel showing analytics and quick stats.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPackage,
    FiUsers,
    FiShoppingCart,
    FiTool,
    FiDollarSign,
    FiTrendingUp,
    FiArrowRight
} from 'react-icons/fi';
import { getOrderStats } from '../../services/orderService';
import { getServiceStats } from '../../services/serviceRequestService';
import { getUserStats } from '../../services/userService';
import { getAllProducts } from '../../services/productService';
import Loading from '../../components/common/Loading';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        orders: null,
        services: null,
        users: null,
        products: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [orderStats, serviceStats, userStats, products] = await Promise.all([
                    getOrderStats(),
                    getServiceStats(),
                    getUserStats(),
                    getAllProducts()
                ]);

                setStats({
                    orders: orderStats,
                    services: serviceStats,
                    users: userStats,
                    products: products.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    if (loading) {
        return <Loading fullScreen message="Loading dashboard..." />;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon"><FiDollarSign /></div>
                    <div className="stat-content">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">{formatCurrency(stats.orders?.totalRevenue)}</span>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon"><FiShoppingCart /></div>
                    <div className="stat-content">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">{stats.orders?.total || 0}</span>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon"><FiPackage /></div>
                    <div className="stat-content">
                        <span className="stat-label">Products</span>
                        <span className="stat-value">{stats.products}</span>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon"><FiUsers /></div>
                    <div className="stat-content">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{stats.users?.total || 0}</span>
                    </div>
                </div>
            </div>

            {/* Order Status Cards */}
            <div className="section-header">
                <h2>Order Overview</h2>
                <Link to="/admin/orders" className="view-all-link">View All <FiArrowRight /></Link>
            </div>

            <div className="order-status-grid">
                <div className="status-card pending">
                    <span className="status-count">{stats.orders?.pending || 0}</span>
                    <span className="status-label">Pending</span>
                </div>
                <div className="status-card confirmed">
                    <span className="status-count">{stats.orders?.confirmed || 0}</span>
                    <span className="status-label">Confirmed</span>
                </div>
                <div className="status-card shipped">
                    <span className="status-count">{stats.orders?.shipped || 0}</span>
                    <span className="status-label">Shipped</span>
                </div>
                <div className="status-card delivered">
                    <span className="status-count">{stats.orders?.delivered || 0}</span>
                    <span className="status-label">Delivered</span>
                </div>
            </div>

            {/* Service Requests */}
            <div className="section-header">
                <h2>Service Requests</h2>
                <Link to="/admin/services" className="view-all-link">View All <FiArrowRight /></Link>
            </div>

            <div className="service-status-grid">
                <div className="status-card received">
                    <FiTool />
                    <span className="status-count">{stats.services?.received || 0}</span>
                    <span className="status-label">Received</span>
                </div>
                <div className="status-card in-progress">
                    <FiTrendingUp />
                    <span className="status-count">{stats.services?.inProgress || 0}</span>
                    <span className="status-label">In Progress</span>
                </div>
                <div className="status-card completed">
                    <FiPackage />
                    <span className="status-count">{stats.services?.completed || 0}</span>
                    <span className="status-label">Completed</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/products/add" className="action-card">
                        <FiPackage />
                        <span>Add Product</span>
                    </Link>
                    <Link to="/admin/orders" className="action-card">
                        <FiShoppingCart />
                        <span>Manage Orders</span>
                    </Link>
                    <Link to="/admin/services" className="action-card">
                        <FiTool />
                        <span>Service Requests</span>
                    </Link>
                    <Link to="/admin/users" className="action-card">
                        <FiUsers />
                        <span>View Users</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
