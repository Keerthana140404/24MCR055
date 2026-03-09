/**
 * Authentication Context
 * ======================
 * This context manages all authentication-related state and functions.
 * It provides:
 * - Current user state
 * - User role (admin/user)
 * - Login, Register, Logout functions
 * - Loading state for auth operations
 * 
 * The context uses Firebase Authentication and stores user roles in Firestore.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to easily access auth context in any component
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * AuthProvider Component
 * Wraps the entire application to provide authentication state globally
 */
export const AuthProvider = ({ children }) => {
    // State for storing current authenticated user
    const [currentUser, setCurrentUser] = useState(null);
    // State for storing user role (admin or user)
    const [userRole, setUserRole] = useState(null);
    // Loading state while checking authentication status
    const [loading, setLoading] = useState(true);
    // State for tracking auth operation errors
    const [error, setError] = useState(null);

    /**
     * Register a new user
     * Creates user in Firebase Auth and stores additional data in Firestore
     */
    const register = async (email, password, name, phone) => {
        try {
            setError(null);
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, { displayName: name });

            // Store additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                phone: phone,
                role: 'user', // Default role is 'user'
                createdAt: new Date().toISOString(),
                profileImage: null
            });

            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Login existing user
     * Authenticates user and fetches their role from Firestore
     */
    const login = async (email, password) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Logout current user
     * Signs out from Firebase Authentication
     */
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
            setUserRole(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Fetch user role from Firestore
     * Used to determine if user is admin or regular user
     */
    const fetchUserRole = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data().role;
            }
            return 'user'; // Default to user role
        } catch (err) {
            console.error('Error fetching user role:', err);
            return 'user';
        }
    };

    /**
     * Effect hook to monitor authentication state changes
     * Runs on component mount and updates state when auth state changes
     */
    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch user role when user is authenticated
                const role = await fetchUserRole(user.uid);
                setUserRole(role);
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    // Context value containing all auth-related state and functions
    const value = {
        currentUser,
        userRole,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin: userRole === 'admin',
        isUser: userRole === 'user'
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Only render children when initial auth check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
