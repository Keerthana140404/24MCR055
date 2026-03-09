/**
 * Order Service
 * =============
 * This service handles all order-related operations with Firebase.
 * It provides functionality for:
 * - Creating new orders
 * - Fetching orders (all orders, user-specific orders)
 * - Updating order status
 * - Order analytics
 * 
 * Order statuses: pending, confirmed, shipped, delivered, cancelled
 */

import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection reference for orders
const ordersCollection = collection(db, 'orders');

/**
 * Create a new order
 * @param {Object} orderData - The order data including items, user info, etc.
 * @returns {Promise<Object>} - The created order with ID
 */
export const createOrder = async (orderData) => {
    try {
        const order = {
            ...orderData,
            status: 'pending', // Initial status
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(ordersCollection, order);

        return {
            id: docRef.id,
            ...order
        };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

/**
 * Get all orders (for admin)
 * @returns {Promise<Array>} - Array of all orders
 */
export const getAllOrders = async () => {
    try {
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

/**
 * Get orders for a specific user
 * @param {string} userId - The user ID to filter orders by
 * @returns {Promise<Array>} - Array of user's orders
 */
export const getUserOrders = async (userId) => {
    try {
        const q = query(
            ordersCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

/**
 * Get a single order by ID
 * @param {string} orderId - The order ID
 * @returns {Promise<Object|null>} - The order object or null
 */
export const getOrderById = async (orderId) => {
    try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));

        if (orderDoc.exists()) {
            return {
                id: orderDoc.id,
                ...orderDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

/**
 * Update order status
 * @param {string} orderId - The order ID to update
 * @param {string} status - The new status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

/**
 * Get orders by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} - Array of orders with the specified status
 */
export const getOrdersByStatus = async (status) => {
    try {
        const q = query(
            ordersCollection,
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        throw error;
    }
};

/**
 * Get order statistics for dashboard
 * @returns {Promise<Object>} - Object containing order statistics
 */
export const getOrderStats = async () => {
    try {
        const allOrders = await getAllOrders();

        const stats = {
            total: allOrders.length,
            pending: allOrders.filter(o => o.status === 'pending').length,
            confirmed: allOrders.filter(o => o.status === 'confirmed').length,
            shipped: allOrders.filter(o => o.status === 'shipped').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: allOrders
                .filter(o => o.status !== 'cancelled')
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        };

        return stats;
    } catch (error) {
        console.error('Error fetching order stats:', error);
        throw error;
    }
};
