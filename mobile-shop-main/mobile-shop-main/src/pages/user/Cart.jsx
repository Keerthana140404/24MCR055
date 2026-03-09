/**
 * Cart Page Component
 * ===================
 * Displays the user's shopping cart with:
 * - List of cart items
 * - Quantity adjustments
 * - Remove item functionality
 * - Order summary and checkout
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiTrash2,
    FiMinus,
    FiPlus,
    FiShoppingBag,
    FiArrowRight,
    FiTag
} from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/orderService';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
    const { currentUser } = useAuth();

    // State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Handle coupon code
    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'MOBILE10') {
            const discountAmount = subtotal * 0.1;
            setDiscount(discountAmount);
            toast.success('Coupon applied! 10% discount added.');
        } else if (couponCode.toUpperCase() === 'FIRST50') {
            setDiscount(50);
            toast.success('Coupon applied! ₹50 discount added.');
        } else {
            toast.error('Invalid coupon code');
        }
    };

    // Handle shipping info change
    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    // Handle checkout
    const handleCheckout = async () => {
        // Validate shipping info
        if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state ||
            !shippingInfo.pincode || !shippingInfo.phone) {
            toast.error('Please fill in all shipping details');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userEmail: currentUser.email,
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    brand: item.brand,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                })),
                shippingInfo,
                subtotal,
                discount,
                shipping,
                totalAmount: total,
                paymentMethod: 'COD' // Cash on Delivery
            };

            await createOrder(orderData);
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/my-orders');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Empty cart view
    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <FiShoppingBag />
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products yet.</p>
                    <Link to="/products" className="btn btn-primary">
                        <FiShoppingBag /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="cart-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                            <span></span>
                        </div>

                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-product">
                                    <div className="item-image">
                                        <img
                                            src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Product'}
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="item-details">
                                        <Link to={`/products/${item.id}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <span className="item-brand">{item.brand}</span>
                                    </div>
                                </div>

                                <div className="item-price">
                                    {formatPrice(item.price)}
                                </div>

                                <div className="item-quantity">
                                    <div className="quantity-control">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </div>

                                <button
                                    className="remove-item-btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}

                        {/* Coupon Code */}
                        <div className="coupon-section">
                            <div className="coupon-input">
                                <FiTag className="coupon-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button onClick={applyCoupon}>Apply</button>
                            </div>
                            <p className="coupon-hint">Try: MOBILE10 or FIRST50</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <div className="order-summary">
                            <h3>Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            {discount > 0 && (
                                <div className="summary-row discount">
                                    <span>Discount</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>

                            {shipping === 0 && (
                                <p className="free-shipping-note">🎉 You qualify for free shipping!</p>
                            )}

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            {!showCheckout ? (
                                <button
                                    className="checkout-btn"
                                    onClick={() => setShowCheckout(true)}
                                >
                                    Proceed to Checkout <FiArrowRight />
                                </button>
                            ) : (
                                <div className="checkout-form">
                                    <h4>Shipping Details</h4>

                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Full Address"
                                            value={shippingInfo.address}
                                            onChange={handleShippingChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={shippingInfo.city}
                                            onChange={handleShippingChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={shippingInfo.state}
                                            onChange={handleShippingChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="Pincode"
                                            value={shippingInfo.pincode}
                                            onChange={handleShippingChange}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={shippingInfo.phone}
                                            onChange={handleShippingChange}
                                            required
                                        />
                                    </div>

                                    <div className="payment-method">
                                        <h4>Payment Method</h4>
                                        <label className="payment-option selected">
                                            <input type="radio" name="payment" checked readOnly />
                                            <span>Cash on Delivery</span>
                                        </label>
                                    </div>

                                    <button
                                        className="place-order-btn"
                                        onClick={handleCheckout}
                                        disabled={loading}
                                    >
                                        {loading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
