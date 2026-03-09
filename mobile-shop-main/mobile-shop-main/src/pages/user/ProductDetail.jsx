/**
 * Product Detail Page Component
 * =============================
 * Displays detailed information about a single product.
 * Features:
 * - Large product image gallery
 * - Detailed specifications
 * - Add to cart functionality
 * - Related products
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiHeart,
    FiShare2,
    FiTruck,
    FiShield,
    FiRotateCcw,
    FiMinus,
    FiPlus,
    FiArrowLeft
} from 'react-icons/fi';
import { getProductById, getAllProducts } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();
    const { currentUser, isAdmin } = useAuth();

    // State
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                if (productData) {
                    setProduct(productData);

                    // Fetch related products (same brand)
                    const allProducts = await getAllProducts();
                    const related = allProducts
                        .filter(p => p.brand === productData.brand && p.id !== id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle quantity changes
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!currentUser) {
            toast.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (isAdmin) {
            toast.info('Admin users cannot add items to cart');
            return;
        }

        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return <Loading fullScreen message="Loading product..." />;
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/products" className="btn btn-primary">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <span className="current">{product.name}</span>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="product-detail-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>

                <div className="product-detail-grid">
                    {/* Product Image */}
                    <div className="product-image-section">
                        <div className="main-image">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'}
                                alt={product.name}
                            />
                            {product.badge && (
                                <span className={`product-badge ${product.badge.toLowerCase()}`}>
                                    {product.badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <span className="product-brand-label">{product.brand}</span>
                        <h1 className="product-title">{product.name}</h1>

                        {/* Price */}
                        <div className="product-price-block">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <>
                                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                    <span className="discount-badge">
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="product-short-desc">
                            {product.description || 'Experience premium quality with this amazing smartphone.'}
                        </p>

                        {/* Specifications Preview */}
                        {product.specs && (
                            <div className="specs-preview">
                                {product.specs.display && (
                                    <div className="spec-item">
                                        <span className="spec-label">Display</span>
                                        <span className="spec-value">{product.specs.display}</span>
                                    </div>
                                )}
                                {product.specs.processor && (
                                    <div className="spec-item">
                                        <span className="spec-label">Processor</span>
                                        <span className="spec-value">{product.specs.processor}</span>
                                    </div>
                                )}
                                {product.specs.ram && (
                                    <div className="spec-item">
                                        <span className="spec-label">RAM</span>
                                        <span className="spec-value">{product.specs.ram}</span>
                                    </div>
                                )}
                                {product.specs.storage && (
                                    <div className="spec-item">
                                        <span className="spec-label">Storage</span>
                                        <span className="spec-value">{product.specs.storage}</span>
                                    </div>
                                )}
                                {product.specs.battery && (
                                    <div className="spec-item">
                                        <span className="spec-label">Battery</span>
                                        <span className="spec-value">{product.specs.battery}</span>
                                    </div>
                                )}
                                {product.specs.camera && (
                                    <div className="spec-item">
                                        <span className="spec-label">Camera</span>
                                        <span className="spec-value">{product.specs.camera}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.stock > 0 ? (
                                <span className="in-stock">
                                    ✓ In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">✗ Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stock > 0 && !isAdmin && (
                            <div className="purchase-section">
                                <div className="quantity-selector">
                                    <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                                        <FiMinus />
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={increaseQuantity} disabled={quantity >= product.stock}>
                                        <FiPlus />
                                    </button>
                                </div>
                                <button
                                    className={`add-to-cart-btn ${isInCart(product.id) ? 'in-cart' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    <FiShoppingCart />
                                    {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                                <button className="wishlist-btn">
                                    <FiHeart />
                                </button>
                                <button className="share-btn">
                                    <FiShare2 />
                                </button>
                            </div>
                        )}

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature-item">
                                <FiTruck className="feature-icon" />
                                <div>
                                    <span className="feature-title">Free Delivery</span>
                                    <span className="feature-desc">Orders above ₹999</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <FiShield className="feature-icon" />
                                <div>
                                    <span className="feature-title">1 Year Warranty</span>
                                    <span className="feature-desc">Manufacturer warranty</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <FiRotateCcw className="feature-icon" />
                                <div>
                                    <span className="feature-title">7 Day Returns</span>
                                    <span className="feature-desc">Easy return policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="tabs-header">
                        <button
                            className={activeTab === 'description' ? 'active' : ''}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={activeTab === 'specifications' ? 'active' : ''}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specifications
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>
                    <div className="tabs-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <p>{product.description || 'No description available for this product.'}</p>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="tab-panel">
                                {product.specs ? (
                                    <table className="specs-table">
                                        <tbody>
                                            {Object.entries(product.specs).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="spec-name">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                                    <td className="spec-value">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No specifications available.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <p>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products">
                        <h2>Related Products</h2>
                        <div className="related-grid">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
