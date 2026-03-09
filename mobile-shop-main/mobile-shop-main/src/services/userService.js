/**
 * User Service
 * ============
 * This service handles all user-related operations with Firebase.
 * It provides functionality for:
 * - Fetching user profiles
 * - Updating user information
 * - Getting all users (admin)
 * - Managing user roles
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection reference for users
const usersCollection = collection(db, 'users');

/**
 * Get all users (for admin)
 * @returns {Promise<Array>} - Array of all users
 */
export const getAllUsers = async () => {
    try {
        const q = query(usersCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Get a user by their UID
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<Object|null>} - The user object or null
 */
export const getUserById = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (userDoc.exists()) {
            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {string} uid - The user's Firebase UID
 * @param {Object} updateData - The data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updateData) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...updateData,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Update user role (admin only)
 * @param {string} uid - The user's Firebase UID
 * @param {string} role - The new role ('admin' or 'user')
 * @returns {Promise<void>}
 */
export const updateUserRole = async (uid, role) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            role,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

/**
 * Get users by role
 * @param {string} role - The role to filter by
 * @returns {Promise<Array>} - Array of users with the specified role
 */
export const getUsersByRole = async (role) => {
    try {
        const q = query(usersCollection, where('role', '==', role));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching users by role:', error);
        throw error;
    }
};

/**
 * Get user statistics for dashboard
 * @returns {Promise<Object>} - Object containing user statistics
 */
export const getUserStats = async () => {
    try {
        const allUsers = await getAllUsers();

        const stats = {
            total: allUsers.length,
            admins: allUsers.filter(u => u.role === 'admin').length,
            users: allUsers.filter(u => u.role === 'user').length
        };

        return stats;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};
