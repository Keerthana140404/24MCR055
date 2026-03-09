/**
 * Add/Edit Product Form Component
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import { addProduct, updateProduct, getProductById } from '../../services/productService';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './ProductForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        originalPrice: '',
        stock: '',
        description: '',
        badge: '',
        specs: {
            display: '',
            processor: '',
            ram: '',
            storage: '',
            battery: '',
            camera: ''
        }
    });

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const product = await getProductById(id);
            if (product) {
                setFormData({
                    name: product.name || '',
                    brand: product.brand || '',
                    price: product.price || '',
                    originalPrice: product.originalPrice || '',
                    stock: product.stock || '',
                    description: product.description || '',
                    badge: product.badge || '',
                    specs: product.specs || {}
                });
                if (product.imageUrl) {
                    setImagePreview(product.imageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [name]: value }
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.brand || !formData.price) {
            toast.error('Please fill in required fields');
            return;
        }

        setSaving(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock) || 0
            };

            if (isEditing) {
                await updateProduct(id, productData, imageFile);
                toast.success('Product updated successfully');
            } else {
                await addProduct(productData, imageFile);
                toast.success('Product added successfully');
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading fullScreen message="Loading product..." />;

    return (
        <div className="product-form-page">
            <div className="form-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </button>
                <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    {/* Left Column - Image */}
                    <div className="form-section image-section">
                        <h3>Product Image</h3>
                        <div className="image-upload">
                            {imagePreview ? (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                    <button type="button" className="remove-image" onClick={removeImage}>
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-area">
                                    <FiUpload />
                                    <span>Click to upload image</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="form-section details-section">
                        <h3>Product Details</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Brand *</label>
                                <select name="brand" value={formData.brand} onChange={handleChange} required>
                                    <option value="">Select Brand</option>
                                    <option value="Apple">Apple</option>
                                    <option value="Samsung">Samsung</option>
                                    <option value="OnePlus">OnePlus</option>
                                    <option value="Xiaomi">Xiaomi</option>
                                    <option value="Realme">Realme</option>
                                    <option value="Vivo">Vivo</option>
                                    <option value="OPPO">OPPO</option>
                                    <option value="Google">Google</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Original Price (₹)</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
                        </div>

                        <div className="form-group">
                            <label>Badge</label>
                            <select name="badge" value={formData.badge} onChange={handleChange}>
                                <option value="">No Badge</option>
                                <option value="New">New</option>
                                <option value="Sale">Sale</option>
                                <option value="Bestseller">Bestseller</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="form-section specs-section">
                    <h3>Specifications</h3>
                    <div className="specs-grid">
                        <div className="form-group">
                            <label>Display</label>
                            <input type="text" name="display" value={formData.specs.display || ''} onChange={handleSpecChange} placeholder="6.7 inch AMOLED" />
                        </div>
                        <div className="form-group">
                            <label>Processor</label>
                            <input type="text" name="processor" value={formData.specs.processor || ''} onChange={handleSpecChange} placeholder="Snapdragon 8 Gen 2" />
                        </div>
                        <div className="form-group">
                            <label>RAM</label>
                            <input type="text" name="ram" value={formData.specs.ram || ''} onChange={handleSpecChange} placeholder="8GB" />
                        </div>
                        <div className="form-group">
                            <label>Storage</label>
                            <input type="text" name="storage" value={formData.specs.storage || ''} onChange={handleSpecChange} placeholder="256GB" />
                        </div>
                        <div className="form-group">
                            <label>Battery</label>
                            <input type="text" name="battery" value={formData.specs.battery || ''} onChange={handleSpecChange} placeholder="5000mAh" />
                        </div>
                        <div className="form-group">
                            <label>Camera</label>
                            <input type="text" name="camera" value={formData.specs.camera || ''} onChange={handleSpecChange} placeholder="50MP + 12MP + 10MP" />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        <FiSave /> {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
