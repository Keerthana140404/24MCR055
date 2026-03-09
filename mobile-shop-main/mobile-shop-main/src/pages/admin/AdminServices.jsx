/**
 * Admin Service Requests Management Component
 */

import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import { getAllServiceRequests, updateServiceRequest } from '../../services/serviceRequestService';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './AdminServices.css';

const AdminServices = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [technicianNotes, setTechnicianNotes] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getAllServiceRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load service requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            await updateServiceRequest(requestId, { status: newStatus });
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleUpdateRequest = async () => {
        if (!selectedRequest) return;
        try {
            await updateServiceRequest(selectedRequest.id, {
                technicianNotes,
                estimatedCost: estimatedCost ? Number(estimatedCost) : null
            });
            setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, technicianNotes, estimatedCost: Number(estimatedCost) } : r));
            toast.success('Request updated');
            setSelectedRequest(null);
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const filteredRequests = requests.filter(r => {
        const matchesSearch = r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.deviceModel?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openDetails = (request) => {
        setSelectedRequest(request);
        setTechnicianNotes(request.technicianNotes || '');
        setEstimatedCost(request.estimatedCost || '');
    };

    if (loading) return <Loading fullScreen message="Loading requests..." />;

    return (
        <div className="admin-services">
            <div className="page-header">
                <h1>Service Requests</h1>
                <span className="request-count">{requests.length} total requests</span>
            </div>

            <div className="filters-bar">
                <div className="search-bar">
                    <FiSearch />
                    <input type="text" placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="received">Received</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="requests-table-container">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Device</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(request => (
                            <tr key={request.id}>
                                <td className="request-id">#{request.id.slice(0, 8).toUpperCase()}</td>
                                <td>
                                    <div className="customer-info">
                                        <span className="customer-name">{request.userName || 'N/A'}</span>
                                        <span className="customer-phone">{request.contactPhone}</span>
                                    </div>
                                </td>
                                <td>{request.serviceName}</td>
                                <td>{request.deviceBrand} {request.deviceModel}</td>
                                <td>{formatDate(request.createdAt)}</td>
                                <td>
                                    <select
                                        className={`status-select ${request.status}`}
                                        value={request.status}
                                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                    >
                                        <option value="received">Received</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => openDetails(request)}>
                                        <FiEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRequests.length === 0 && <div className="no-results"><p>No requests found</p></div>}
            </div>

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="request-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
                        <h2>Service Request Details</h2>
                        <div className="request-details">
                            <p><strong>Request ID:</strong> #{selectedRequest.id.slice(0, 8).toUpperCase()}</p>
                            <p><strong>Customer:</strong> {selectedRequest.userName}</p>
                            <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                            <p><strong>Phone:</strong> {selectedRequest.contactPhone}</p>
                            <p><strong>Service:</strong> {selectedRequest.serviceName}</p>
                            <p><strong>Device:</strong> {selectedRequest.deviceBrand} {selectedRequest.deviceModel}</p>
                            <p><strong>Issue:</strong> {selectedRequest.issueDescription}</p>

                            <div className="form-group">
                                <label>Estimated Cost (₹)</label>
                                <input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="Enter cost" />
                            </div>

                            <div className="form-group">
                                <label>Technician Notes</label>
                                <textarea value={technicianNotes} onChange={(e) => setTechnicianNotes(e.target.value)} rows={3} placeholder="Add notes..." />
                            </div>

                            <button className="btn btn-primary" onClick={handleUpdateRequest}>Update Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
