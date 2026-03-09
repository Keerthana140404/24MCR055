/**
 * Cart Context
 * ============
 * This context manages the shopping cart functionality.
 * It provides:
 * - Cart items state
 * - Add to cart functionality
 * - Remove from cart functionality
 * - Update quantity functionality
 * - Cart total calculation
 * - Cart persistence in localStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext();

// Custom hook to access cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

/**
 * CartProvider Component
 * Manages shopping cart state and provides cart functionality to child components
 */
export const CartProvider = ({ children }) => {
    // Get current user to associate cart with specific user
    const { currentUser } = useAuth();

    // State for storing cart items
    const [cartItems, setCartItems] = useState([]);
    // Loading state for cart operations
    const [loading, setLoading] = useState(true);

    /**
     * Load cart from localStorage when component mounts or user changes
     * Each user has their own cart stored with their UID
     */
    useEffect(() => {
        if (currentUser) {
            const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            } else {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
        setLoading(false);
    }, [currentUser]);

    /**
     * Save cart to localStorage whenever it changes
     */
    useEffect(() => {
        if (currentUser && !loading) {
            localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cartItems));
        }
    }, [cartItems, currentUser, loading]);

    /**
     * Add a product to the cart
     * If product already exists, increase its quantity
     */
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Product exists, update quantity
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Product doesn't exist, add new item
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    /**
     * Remove a product from the cart completely
     */
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    /**
     * Update the quantity of a specific item in the cart
     */
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    /**
     * Clear all items from the cart
     */
    const clearCart = () => {
        setCartItems([]);
        if (currentUser) {
            localStorage.removeItem(`cart_${currentUser.uid}`);
        }
    };

    /**
     * Calculate total number of items in cart
     */
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Calculate total price of all items in cart
     */
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    /**
     * Check if a specific product is in the cart
     */
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    // Context value with all cart-related state and functions
    const value = {
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
