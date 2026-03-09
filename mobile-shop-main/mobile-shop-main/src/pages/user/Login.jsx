/**
 * Login Page Component
 * ====================
 * Handles user authentication with email and password.
 * Features:
 * - Email and password input validation
 * - Error handling and display
 * - Remember me functionality
 * - Link to registration page
 * - Responsive design
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiSmartphone, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get auth context and navigation
    const { login, userRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path from location state or default to home
    const from = location.state?.from?.pathname || '/';

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            toast.success('Login successful!');

            // Redirect based on role (handled by useEffect or after role is fetched)
            // For now, redirect to the intended page or home
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 500);
        } catch (error) {
            console.error('Login error:', error);

            // Handle specific Firebase auth errors
            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <Link to="/" className="auth-logo">
                            <FiSmartphone />
                            <span>Mohan Mobileshop</span>
                        </Link>
                        <h1 className="branding-title">Welcome Back!</h1>
                        <p className="branding-description">
                            Sign in to access your account, track orders, and manage your service requests.
                        </p>
                        <div className="branding-features">
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                Track your orders in real-time
                            </div>
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                Manage service requests
                            </div>
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                Exclusive member discounts
                            </div>
                        </div>
                    </div>
                    <div className="branding-pattern"></div>
                </div>

                {/* Right side - Login Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        //placeholder="Enter your email"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        //placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner"></span>
                                        Signing in...
                                    </span>
                                ) : (
                                    <>
                                        <FiLogIn />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        {/* Sign Up Link */}
                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <Link to="/register">Create one now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
