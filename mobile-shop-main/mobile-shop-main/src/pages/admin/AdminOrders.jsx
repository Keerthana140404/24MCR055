/**
 * Admin Orders Management Component
 */

import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success('Order status updated');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.userName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <Loading fullScreen message="Loading orders..." />;

    return (
        <div className="admin-orders">
            <div className="page-header">
                <h1>Orders Management</h1>
                <span className="order-count">{orders.length} total orders</span>
            </div>

            <div className="filters-bar">
                <div className="search-bar">
                    <FiSearch />
                    <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="order-id">#{order.id.slice(0, 8).toUpperCase()}</td>
                                <td>
                                    <div className="customer-info">
                                        <span className="customer-name">{order.userName || 'N/A'}</span>
                                        <span className="customer-email">{order.userEmail}</span>
                                    </div>
                                </td>
                                <td>{order.items?.length || 0} items</td>
                                <td className="order-total">{formatPrice(order.totalAmount)}</td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>
                                    <select
                                        className={`status-select ${order.status}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                                        <FiEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && <div className="no-results"><p>No orders found</p></div>}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                        <h2>Order Details</h2>
                        <div className="order-details">
                            <p><strong>Order ID:</strong> #{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                            <p><strong>Customer:</strong> {selectedOrder.userName}</p>
                            <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                            <p><strong>Address:</strong> {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city}</p>
                            <p><strong>Phone:</strong> {selectedOrder.shippingInfo?.phone}</p>
                            <h3>Items</h3>
                            <div className="order-items-list">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span>{item.name} ({item.brand})</span>
                                        <span>x{item.quantity}</span>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary">
                                <p><strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
