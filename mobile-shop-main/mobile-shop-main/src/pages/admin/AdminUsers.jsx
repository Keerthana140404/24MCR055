/**
 * Admin Users Management Component
 */

import React, { useState, useEffect } from 'react';
import { FiSearch, FiUsers, FiShield } from 'react-icons/fi';
import { getAllUsers, updateUserRole } from '../../services/userService';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        try {
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success('User role updated');
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return <Loading fullScreen message="Loading users..." />;

    return (
        <div className="admin-users">
            <div className="page-header">
                <h1>Users Management</h1>
                <div className="user-stats">
                    <span><FiUsers /> {users.filter(u => u.role === 'user').length} Users</span>
                    <span><FiShield /> {users.filter(u => u.role === 'admin').length} Admins</span>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-bar">
                    <FiSearch />
                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
                                        <span className="user-name">{user.name || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="user-email">{user.email}</td>
                                <td>{user.phone || 'N/A'}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <select
                                        className={`role-select ${user.role}`}
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="no-results"><p>No users found</p></div>}
            </div>
        </div>
    );
};

export default AdminUsers;
