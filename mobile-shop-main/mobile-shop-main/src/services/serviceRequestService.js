/**
 * Service Request Service
 * =======================
 * This service handles all mobile repair/service request operations.
 * Service types include:
 * - Screen repair
 * - Battery replacement
 * - Software issues
 * - Water damage
 * - General repair
 * 
 * Service statuses: received, in-progress, completed, cancelled
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

// Collection reference for service requests
const serviceRequestsCollection = collection(db, 'serviceRequests');

/**
 * Available service types for mobile repair
 */
export const SERVICE_TYPES = [
    { id: 'screen_repair', name: 'Screen Repair', description: 'Cracked or broken screen replacement' },
    { id: 'battery_replacement', name: 'Battery Replacement', description: 'Battery not holding charge or swelling' },
    { id: 'display_change', name: 'Display Change', description: 'LCD or AMOLED display replacement' },
    { id: 'software_issue', name: 'Software Issue', description: 'OS problems, app crashes, slow performance' },
    { id: 'water_damage', name: 'Water Damage', description: 'Phone exposed to water or moisture' },
    { id: 'charging_port', name: 'Charging Port Repair', description: 'Charging issues or loose port' },
    { id: 'speaker_mic', name: 'Speaker/Mic Repair', description: 'Audio or microphone problems' },
    { id: 'camera_repair', name: 'Camera Repair', description: 'Camera not working or blurry images' },
    { id: 'general_repair', name: 'General Repair', description: 'Other mobile issues' }
];

/**
 * Create a new service request
 * @param {Object} requestData - The service request data
 * @returns {Promise<Object>} - The created service request with ID
 */
export const createServiceRequest = async (requestData) => {
    try {
        const serviceRequest = {
            ...requestData,
            status: 'received', // Initial status
            estimatedCost: null,
            technicianNotes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await addDoc(serviceRequestsCollection, serviceRequest);

        return {
            id: docRef.id,
            ...serviceRequest
        };
    } catch (error) {
        console.error('Error creating service request:', error);
        throw error;
    }
};

/**
 * Get all service requests (for admin)
 * @returns {Promise<Array>} - Array of all service requests
 */
export const getAllServiceRequests = async () => {
    try {
        const q = query(serviceRequestsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching service requests:', error);
        throw error;
    }
};

/**
 * Get service requests for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of user's service requests
 */
export const getUserServiceRequests = async (userId) => {
    try {
        const q = query(
            serviceRequestsCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user service requests:', error);
        throw error;
    }
};

/**
 * Get a single service request by ID
 * @param {string} requestId - The service request ID
 * @returns {Promise<Object|null>} - The service request or null
 */
export const getServiceRequestById = async (requestId) => {
    try {
        const requestDoc = await getDoc(doc(db, 'serviceRequests', requestId));

        if (requestDoc.exists()) {
            return {
                id: requestDoc.id,
                ...requestDoc.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching service request:', error);
        throw error;
    }
};

/**
 * Update service request status and details
 * @param {string} requestId - The service request ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<void>}
 */
export const updateServiceRequest = async (requestId, updateData) => {
    try {
        const requestRef = doc(db, 'serviceRequests', requestId);
        await updateDoc(requestRef, {
            ...updateData,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating service request:', error);
        throw error;
    }
};

/**
 * Get service requests by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} - Array of service requests with the specified status
 */
export const getServiceRequestsByStatus = async (status) => {
    try {
        const q = query(
            serviceRequestsCollection,
            where('status', '==', status),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching service requests by status:', error);
        throw error;
    }
};

/**
 * Get service request statistics for dashboard
 * @returns {Promise<Object>} - Object containing service request statistics
 */
export const getServiceStats = async () => {
    try {
        const allRequests = await getAllServiceRequests();

        const stats = {
            total: allRequests.length,
            received: allRequests.filter(r => r.status === 'received').length,
            inProgress: allRequests.filter(r => r.status === 'in-progress').length,
            completed: allRequests.filter(r => r.status === 'completed').length,
            cancelled: allRequests.filter(r => r.status === 'cancelled').length
        };

        return stats;
    } catch (error) {
        console.error('Error fetching service stats:', error);
        throw error;
    }
};
