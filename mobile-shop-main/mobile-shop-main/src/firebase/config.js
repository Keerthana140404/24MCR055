/**
 * Firebase Configuration File
 * ===========================
 * This file initializes Firebase services for the mobile shop application.
 * It exports all necessary Firebase modules that will be used throughout the app:
 * - Authentication: For user login/registration
 * - Firestore: For storing products, orders, users, and service requests
 * - Storage: For uploading and storing product images
 * - Analytics: For tracking app usage
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration object containing all necessary credentials
// These values connect the app to your specific Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyBPy2sa9vamNGF4kIjyxUnDqBLVlgiVTqY",
    authDomain: "finalproject-93043.firebaseapp.com",
    databaseURL: "https://finalproject-93043-default-rtdb.firebaseio.com",
    projectId: "finalproject-93043",
    storageBucket: "finalproject-93043.firebasestorage.app",
    messagingSenderId: "842504476794",
    appId: "1:842504476794:web:17ac0c42375962b64f83c3",
    measurementId: "G-E5B5ZSZJRP"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics for tracking user behavior
const analytics = getAnalytics(app);

// Initialize Firebase Authentication for user management
const auth = getAuth(app);

// Initialize Firestore database for structured data storage
const db = getFirestore(app);

// Initialize Realtime Database for real-time data sync
const realtimeDb = getDatabase(app);

// Initialize Firebase Storage for file/image uploads
const storage = getStorage(app);

// Export all Firebase services for use in other parts of the application
export { app, analytics, auth, db, realtimeDb, storage };
