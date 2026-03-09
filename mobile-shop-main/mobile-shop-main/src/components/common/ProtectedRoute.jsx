/**
 * Protected Route Component
 * =========================
 * This component handles route protection based on authentication and role.
 * It's used to:
 * - Protect routes that require authentication
 * - Restrict admin routes to admin users only
 * - Redirect unauthorized users appropriately
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

/**
 * ProtectedRoute - Protects routes that require authentication
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {boolean} props.adminOnly - If true, only admin users can access
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { currentUser, userRole, loading } = useAuth();
    const location = useLocation();

    // Show loading while checking authentication
    if (loading) {
        return <Loading fullScreen message="Checking authentication..." />;
    }

    // If not authenticated, redirect to login
    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route requires admin access but user is not admin
    if (adminOnly && userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has required role
    return children;
};

/**
 * PublicRoute - Routes that should only be accessible when NOT logged in
 * (e.g., login, register pages)
 */
export const PublicRoute = ({ children }) => {
    const { currentUser, userRole, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return <Loading fullScreen message="Loading..." />;
    }

    // If authenticated, redirect based on role
    if (currentUser) {
        if (userRole === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // User is not authenticated, show public route
    return children;
};

export default ProtectedRoute;
