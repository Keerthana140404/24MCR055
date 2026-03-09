/**
 * Home Page Component
 * ===================
 * The main landing page of the mobile shop.
 * Features:
 * - Hero section with CTA
 * - Featured products carousel
 * - Services overview
 * - Why choose us section
 * - Testimonials
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSmartphone,
    FiTool,
    FiTruck,
    FiShield,
    FiHeadphones,
    FiArrowRight,
    FiStar,
    FiZap,
    FiAward,
    FiHeart
} from 'react-icons/fi';
import { getAllProducts } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import './Home.css';

const Home = () => {
    // State for featured products
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch featured products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                // Get first 8 products as featured
                setFeaturedProducts(products.slice(0, 8));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Services data
    const services = [
        {
            icon: <FiSmartphone />,
            title: 'Screen Repair',
            description: 'Professional screen replacement for all mobile brands'
        },
        {
            icon: <FiZap />,
            title: 'Battery Replacement',
            description: 'Quick battery replacement to restore your phone\'s life'
        },
        {
            icon: <FiTool />,
            title: 'Software Fix',
            description: 'Expert software troubleshooting and updates'
        },
        {
            icon: <FiShield />,
            title: 'Water Damage',
            description: 'Specialized treatment for water-damaged devices'
        }
    ];

    // Why choose us features
    const features = [
        {
            icon: <FiTruck />,
            title: 'Fast Delivery',
            description: 'Free shipping on orders above ₹999'
        },
        {
            icon: <FiShield />,
            title: 'Genuine Products',
            description: '100% authentic products guaranteed'
        },
        {
            icon: <FiHeadphones />,
            title: '24/7 Support',
            description: 'Round the clock customer support'
        },
        {
            icon: <FiAward />,
            title: 'Best Prices',
            description: 'Competitive pricing on all products'
        }
    ];

    // Sample brands
    const brands = [
        'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'OPPO', 'Google'
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>
                <div className="hero-container">
                    <div className="hero-content">
                        <span className="hero-badge">
                            <FiStar /> New Arrivals 2024
                        </span>
                        <h1 className="hero-title">
                            Premium Mobile Phones
                            <span className="gradient-text"> & Expert Services</span>
                        </h1>
                        <p className="hero-description">
                            Discover the latest smartphones from top brands. Plus, get expert repair
                            services for all your mobile needs. Quality products, trusted service.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                <FiSmartphone /> Shop Now
                            </Link>
                            <Link to="/services" className="btn btn-outline btn-lg">
                                <FiTool /> Our Services
                            </Link>
                        </div>
                        {/* <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">Happy Customers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5K+</span>
                                <span className="stat-label">Repairs Done</span>
                            </div>
                        </div> */}
                    </div>
                    {/* <div className="hero-image">
                        <div className="phone-mockup">
                            <div className="phone-screen">
                                <div className="screen-content">
                                    <FiSmartphone className="phone-icon" />
                                </div>
                            </div>
                            <div className="phone-notch"></div>
                        </div>
                        <div className="floating-card card-1">
                            <FiTruck /> Free Shipping
                        </div>
                        <div className="floating-card card-2">
                            <FiShield /> 1 Year Warranty
                        </div>
                    </div> */}
                </div>
            </section>

            {/* Brands Section */}
            <section className="brands-section">
                <div className="brands-container">
                    <p className="brands-label">Trusted by top brands</p>
                    <div className="brands-list">
                        {brands.map((brand, index) => (
                            <span key={index} className="brand-item">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-container">
                    <div className="section-header">
                        <div className="section-title-group">
                            <span className="section-label">Featured Products</span>
                            <h2 className="section-title">Best Selling Smartphones</h2>
                        </div>
                        <Link to="/products" className="view-all-link">
                            View All <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <Loading message="Loading products..." />
                    ) : featuredProducts.length > 0 ? (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <p>No products available yet. Check back soon!</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="section-container">
                    <div className="section-header centered">
                        <span className="section-label">Expert Services</span>
                        <h2 className="section-title">Professional Mobile Repair</h2>
                        <p className="section-description">
                            Our certified technicians provide top-quality repair services for all major brands
                        </p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon">{service.icon}</div>
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                                <Link to="/services" className="service-link">
                                    Learn More <FiArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="services-cta">
                        <Link to="/services" className="btn btn-primary btn-lg">
                            <FiTool /> Request a Service
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="features-content">
                        <div className="features-text">
                            <span className="section-label">Why Choose Us</span>
                            <h2 className="section-title">The MobileShop Advantage</h2>
                            <p className="section-description">
                                We're committed to providing the best shopping experience with genuine
                                products, competitive prices, and exceptional customer service.
                            </p>
                            <div className="features-list">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <div className="feature-info">
                                            <h4>{feature.title}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="features-visual">
                            <div className="visual-card main-card">
                                <div className="card-header">
                                    <FiHeart className="heart-icon" />
                                    <span>Customer Favorites</span>
                                </div>
                                <div className="card-stats">
                                    <div className="card-stat">
                                        <span className="stat-value">4.9</span>
                                        <span className="stat-desc">Average Rating</span>
                                    </div>
                                    <div className="card-stat">
                                        <span className="stat-value">98%</span>
                                        <span className="stat-desc">Satisfaction</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Upgrade Your Phone?</h2>
                        <p className="cta-description">
                            Browse our collection of the latest smartphones or get your device repaired by experts.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                <FiSmartphone /> Shop Now
                            </Link>
                            <Link to="/register" className="btn btn-glass btn-lg">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
