/**
 * My Orders Page Component
 * ========================
 * Displays user's order history with status tracking.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPackage,
    FiClock,
    FiCheck,
    FiTruck,
    FiX,
    FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';
import Loading from '../../components/common/Loading';
import './MyOrders.css';

const MyOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (currentUser) {
                try {
                    const userOrders = await getUserOrders(currentUser.uid);
                    setOrders(userOrders);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [currentUser]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiClock />;
            case 'confirmed': return <FiCheck />;
            case 'shipped': return <FiTruck />;
            case 'delivered': return <FiCheck />;
            case 'cancelled': return <FiX />;
            default: return <FiPackage />;
        }
    };

    // Get status color
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'confirmed': return 'status-confirmed';
            case 'shipped': return 'status-shipped';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    // Filter orders by tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    if (loading) {
        return <Loading fullScreen message="Loading your orders..." />;
    }

    return (
        <div className="my-orders-page">
            <div className="orders-container">
                <h1 className="page-title">My Orders</h1>

                {/* Filter Tabs */}
                <div className="order-tabs">
                    <button
                        className={activeTab === 'all' ? 'active' : ''}
                        onClick={() => setActiveTab('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={activeTab === 'shipped' ? 'active' : ''}
                        onClick={() => setActiveTab('shipped')}
                    >
                        Shipped
                    </button>
                    <button
                        className={activeTab === 'delivered' ? 'active' : ''}
                        onClick={() => setActiveTab('delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={activeTab === 'cancelled' ? 'active' : ''}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled
                    </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="orders-list">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-image">
                                                <img
                                                    src={item.imageUrl || 'https://via.placeholder.com/60x60?text=Product'}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="item-details">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-meta">
                                                    {item.brand} • Qty: {item.quantity}
                                                </span>
                                            </div>
                                            <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="shipping-info">
                                        <FiTruck />
                                        <span>{order.shippingInfo?.address}, {order.shippingInfo?.city}</span>
                                    </div>
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-orders">
                        <div className="no-orders-icon">
                            <FiShoppingBag />
                        </div>
                        <h3>No orders found</h3>
                        <p>
                            {activeTab === 'all'
                                ? "You haven't placed any orders yet."
                                : `You don't have any ${activeTab} orders.`}
                        </p>
                        <Link to="/products" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
