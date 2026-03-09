/**
 * Services Page Component
 * =======================
 * Displays available mobile repair services and allows
 * users to submit service requests.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSmartphone,
    FiZap,
    FiMonitor,
    FiSettings,
    FiDroplet,
    FiBattery,
    FiMic,
    FiCamera,
    FiTool,
    FiCheck
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { createServiceRequest, SERVICE_TYPES } from '../../services/serviceRequestService';
import { toast } from 'react-toastify';
import './Services.css';

const Services = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // State
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState({
        deviceBrand: '',
        deviceModel: '',
        issueDescription: '',
        contactPhone: ''
    });

    // Service icons mapping
    const serviceIcons = {
        'screen_repair': <FiSmartphone />,
        'battery_replacement': <FiBattery />,
        'display_change': <FiMonitor />,
        'software_issue': <FiSettings />,
        'water_damage': <FiDroplet />,
        'charging_port': <FiZap />,
        'speaker_mic': <FiMic />,
        'camera_repair': <FiCamera />,
        'general_repair': <FiTool />
    };

    // Handle service selection
    const handleSelectService = (service) => {
        if (!currentUser) {
            toast.warning('Please login to request a service');
            navigate('/login');
            return;
        }
        setSelectedService(service);
        setShowRequestForm(true);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!requestData.deviceBrand || !requestData.deviceModel || !requestData.issueDescription || !requestData.contactPhone) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            await createServiceRequest({
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userEmail: currentUser.email,
                serviceType: selectedService.id,
                serviceName: selectedService.name,
                ...requestData
            });

            toast.success('Service request submitted successfully!');
            setShowRequestForm(false);
            setSelectedService(null);
            setRequestData({
                deviceBrand: '',
                deviceModel: '',
                issueDescription: '',
                contactPhone: ''
            });
            navigate('/my-services');
        } catch (error) {
            console.error('Error submitting service request:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Close form
    const closeForm = () => {
        setShowRequestForm(false);
        setSelectedService(null);
    };

    return (
        <div className="services-page">
            {/* Hero Section */}
            <section className="services-hero">
                <div className="hero-content">
                    <span className="services-badge">Expert Repair Services</span>
                    <h1>Professional Mobile Repair</h1>
                    <p>
                        Our certified technicians provide top-quality repair services for all major
                        smartphone brands. Fast turnaround, genuine parts, and satisfaction guaranteed.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section">
                <div className="services-grid-container">
                    <div className="section-header">
                        <h2>Our Services</h2>
                        <p>Choose the service you need and we'll take care of the rest</p>
                    </div>

                    <div className="services-grid">
                        {SERVICE_TYPES.map(service => (
                            <div key={service.id} className="service-card">
                                <div className="service-icon">
                                    {serviceIcons[service.id]}
                                </div>
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <button
                                    className="request-service-btn"
                                    onClick={() => handleSelectService(service)}
                                >
                                    Request Service
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-section">
                <div className="why-choose-container">
                    <div className="section-header">
                        <h2>Why Choose Our Service?</h2>
                        <p>We're committed to providing the best repair experience</p>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FiCheck />
                            </div>
                            <h4>Certified Technicians</h4>
                            <p>Our experts are trained and certified to handle all types of repairs</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FiCheck />
                            </div>
                            <h4>Genuine Parts</h4>
                            <p>We use only original or high-quality replacement parts</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FiCheck />
                            </div>
                            <h4>Quick Turnaround</h4>
                            <p>Most repairs completed within 24-48 hours</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <FiCheck />
                            </div>
                            <h4>Warranty Included</h4>
                            <p>30-day warranty on all repair services</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Request Form Modal */}
            {showRequestForm && (
                <div className="request-modal-overlay" onClick={closeForm}>
                    <div className="request-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={closeForm}>×</button>

                        <div className="modal-header">
                            <div className="selected-service-icon">
                                {serviceIcons[selectedService.id]}
                            </div>
                            <h3>Request {selectedService.name}</h3>
                            <p>{selectedService.description}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="service-request-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Device Brand *</label>
                                    <select
                                        name="deviceBrand"
                                        value={requestData.deviceBrand}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Brand</option>
                                        <option value="Apple">Apple</option>
                                        <option value="Samsung">Samsung</option>
                                        <option value="OnePlus">OnePlus</option>
                                        <option value="Xiaomi">Xiaomi</option>
                                        <option value="Realme">Realme</option>
                                        <option value="Vivo">Vivo</option>
                                        <option value="OPPO">OPPO</option>
                                        <option value="Google">Google</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Device Model *</label>
                                    <input
                                        type="text"
                                        name="deviceModel"
                                        placeholder="e.g., iPhone 14 Pro"
                                        value={requestData.deviceModel}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Issue Description *</label>
                                <textarea
                                    name="issueDescription"
                                    placeholder="Please describe the issue in detail..."
                                    value={requestData.issueDescription}
                                    onChange={handleInputChange}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact Phone *</label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    placeholder="Enter your phone number"
                                    value={requestData.contactPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-request-btn"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Service Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
