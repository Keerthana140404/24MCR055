/**
 * Product Card Component
 * ======================
 * A reusable card component for displaying product information.
 * Used in product listings on both user and admin panels.
 * 
 * Features:
 * - Product image with fallback
 * - Price display with formatting
 * - Add to cart functionality
 * - Quick view options
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, isInCart } = useCart();
    const { currentUser, isAdmin } = useAuth();

    // Handle add to cart
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            toast.warning('Please login to add items to cart');
            return;
        }

        if (isAdmin) {
            toast.info('Admin users cannot add items to cart');
            return;
        }

        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`);
    };

    // Format price to currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Placeholder image if product doesn't have an image
    const productImage = product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image';

    return (
        <div className="product-card">
            {/* Product Badge (if applicable) */}
            {product.badge && (
                <span className={`product-badge ${product.badge.toLowerCase()}`}>
                    {product.badge}
                </span>
            )}

            {/* Product Image */}
            <div className="product-image-container">
                <img
                    src={productImage}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />

                {/* Quick Actions Overlay */}
                <div className="product-actions">
                    <Link
                        to={`/products/${product.id}`}
                        className="action-btn view-btn"
                        title="View Details"
                    >
                        <FiEye />
                    </Link>
                    <button
                        className="action-btn wishlist-btn"
                        title="Add to Wishlist"
                    >
                        <FiHeart />
                    </button>
                    {!isAdmin && (
                        <button
                            className={`action-btn cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                            onClick={handleAddToCart}
                            title={isInCart(product.id) ? 'Already in Cart' : 'Add to Cart'}
                        >
                            <FiShoppingCart />
                        </button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-name">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                {/* Product Specs Summary */}
                {product.specs && (
                    <div className="product-specs">
                        {product.specs.ram && <span>{product.specs.ram} RAM</span>}
                        {product.specs.storage && <span>{product.specs.storage}</span>}
                    </div>
                )}

                {/* Price Section */}
                <div className="product-price-section">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <>
                            <span className="product-original-price">
                                {formatPrice(product.originalPrice)}
                            </span>
                            <span className="product-discount">
                                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>

                {/* Stock Status */}
                <div className="product-stock">
                    {product.stock > 0 ? (
                        <span className="in-stock">
                            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                        </span>
                    ) : (
                        <span className="out-of-stock">Out of Stock</span>
                    )}
                </div>
            </div>

            {/* Add to Cart Button (Mobile) */}
            {!isAdmin && product.stock > 0 && (
                <button
                    className={`product-add-to-cart ${isInCart(product.id) ? 'in-cart' : ''}`}
                    onClick={handleAddToCart}
                >
                    <FiShoppingCart />
                    <span>{isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
            )}
        </div>
    );
};

export default ProductCard;
