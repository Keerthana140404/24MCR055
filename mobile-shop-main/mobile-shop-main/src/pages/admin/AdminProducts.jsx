/**
 * Admin Products Management Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { getAllProducts, deleteProduct } from '../../services/productService';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;

        setDeleting(product.id);
        try {
            await deleteProduct(product.id, product.imageUrl);
            setProducts(prev => prev.filter(p => p.id !== product.id));
            toast.success('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setDeleting(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loading fullScreen message="Loading products..." />;

    return (
        <div className="admin-products">
            <div className="page-header">
                <h1>Products Management</h1>
                <Link to="/admin/products/add" className="btn btn-primary">
                    <FiPlus /> Add Product
                </Link>
            </div>

            <div className="search-bar">
                <FiSearch />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-cell">
                                        <div className="product-image">
                                            <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt={product.name} />
                                        </div>
                                        <span className="product-name">{product.name}</span>
                                    </div>
                                </td>
                                <td>{product.brand}</td>
                                <td>{formatPrice(product.price)}</td>
                                <td>
                                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.stock > 0 ? product.stock : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={`/admin/products/edit/${product.id}`} className="edit-btn">
                                            <FiEdit2 />
                                        </Link>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(product)}
                                            disabled={deleting === product.id}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
