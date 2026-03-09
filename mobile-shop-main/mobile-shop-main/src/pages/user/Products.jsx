/**
 * Products Page Component
 * =======================
 * Displays all products with filtering and search functionality.
 * Features:
 * - Product grid display
 * - Search functionality
 * - Brand filter
 * - Price range filter
 * - Sort options
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { getAllProducts } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import './Products.css';

const Products = () => {
    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get unique brands from products
    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(p => p.brand))];
        return uniqueBrands.sort();
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        // Brand filter
        if (selectedBrand !== 'all') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        // Price range filter
        result = result.filter(p =>
            p.price >= priceRange.min && p.price <= priceRange.max
        );

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }, [products, searchQuery, selectedBrand, priceRange, sortBy]);

    // Format price for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedBrand('all');
        setPriceRange({ min: 0, max: 200000 });
        setSortBy('newest');
    };

    if (loading) {
        return <Loading fullScreen message="Loading products..." />;
    }

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-header">
                <div className="header-content">
                    <h1>Mobile Phones</h1>
                    <p>Discover our collection of premium smartphones from top brands</p>
                </div>
            </div>

            <div className="products-container">
                {/* Filters Sidebar */}
                <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button className="close-filters" onClick={() => setShowFilters(false)}>
                            <FiX />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="filter-group">
                        <label>Search</label>
                        <div className="search-input">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="filter-group">
                        <label>Brand</label>
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="all">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                            />
                            <span>to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="price-range-display">
                            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button className="reset-filters-btn" onClick={resetFilters}>
                        Reset Filters
                    </button>
                </aside>

                {/* Main Content */}
                <main className="products-main">
                    {/* Toolbar */}
                    <div className="products-toolbar">
                        <div className="toolbar-left">
                            <button
                                className="filter-toggle-btn"
                                onClick={() => setShowFilters(true)}
                            >
                                <FiFilter /> Filters
                            </button>
                            <span className="products-count">
                                {filteredProducts.length} products found
                            </span>
                        </div>

                        <div className="toolbar-right">
                            <div className="sort-select">
                                <label>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>

                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FiGrid />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <FiList />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    {filteredProducts.length > 0 ? (
                        <div className={`products-display ${viewMode}`}>
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products-found">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search query</p>
                            <button onClick={resetFilters} className="btn btn-primary">
                                Reset Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Overlay */}
            {showFilters && (
                <div className="filter-overlay" onClick={() => setShowFilters(false)}></div>
            )}
        </div>
    );
};

export default Products;
