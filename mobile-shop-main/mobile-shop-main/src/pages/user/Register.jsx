/**
 * Register Page Component
 * =======================
 * Handles new user registration.
 * Features:
 * - Full name, email, phone, password inputs
 * - Password confirmation and strength indicator
 * - Terms and conditions checkbox
 * - Form validation
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiSmartphone,
    FiUser,
    FiPhone,
    FiUserPlus
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get auth context and navigation
    const { register } = useAuth();
    const navigate = useNavigate();

    /**
     * Handle input changes
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Calculate password strength
     */
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        return { strength, label: labels[strength] };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (!agreeToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            await register(formData.email, formData.password, formData.name, formData.phone);
            toast.success('Registration successful! Welcome to MobileShop!');
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);

            // Handle specific Firebase auth errors
            let errorMessage = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
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
                        <h1 className="branding-title">Join MobileShop</h1>
                        <p className="branding-description">
                            Create an account to start shopping the latest mobile phones and access our repair services.
                        </p>
                        <div className="branding-features">
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                Free shipping on orders above ₹999
                            </div>
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                Expert mobile repair services
                            </div>
                            <div className="feature">
                                <span className="feature-check">✓</span>
                                24/7 customer support
                            </div>
                        </div>
                    </div>
                    <div className="branding-pattern"></div>
                </div>

                {/* Right side - Register Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-form-header">
                            <h2>Create Account</h2>
                            <p>Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {/* Name Input */}
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        //placeholder="Enter your full name"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        //placeholder="Enter your email"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="input-wrapper">
                                    <FiPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        //placeholder="Enter your phone number"
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        //placeholder="Create a password"
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
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="password-strength">
                                        <div className="strength-bars">
                                            {[1, 2, 3, 4].map(level => (
                                                <div
                                                    key={level}
                                                    className={`strength-bar ${passwordStrength.strength >= level ? `level-${level}` : ''}`}
                                                ></div>
                                            ))}
                                        </div>
                                        <span className={`strength-label level-${passwordStrength.strength}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        //placeholder="Confirm your password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <span className="input-error">Passwords do not match</span>
                                )}
                            </div>

                            {/* Terms Checkbox */}
                            <div className="form-group">
                                <label className="checkbox-label terms-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                </label>
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
                                        Creating Account...
                                    </span>
                                ) : (
                                    <>
                                        <FiUserPlus />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        {/* Sign In Link */}
                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
