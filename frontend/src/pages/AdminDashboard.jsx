import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Shield, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ _id: '', name: '', capacity: '', location: '', status: 'Available' });

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchResources();
  }, [user, navigate]);

  const fetchResources = async () => {
    try {
      const res = await axios.get('/api/resources');
      setResources(res.data);
    } catch (error) {
      console.error("Error fetching resources", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({ _id: '', name: '', capacity: '', location: '', status: 'Available' });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEditForm = (resource) => {
    setFormData(resource);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/resources/${formData._id}`, formData);
      } else {
        const { _id, ...newResourceData } = formData;
        await axios.post('/api/resources', newResourceData);
      }
      setShowForm(false);
      fetchResources(); // Refresh list
    } catch (error) {
      alert('Error saving resource. Check console.');
      console.error(error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`/api/resources/${id}`);
        setResources(resources.filter(r => r._id !== id));
      } catch (error) {
        alert('Failed to delete resource.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Shield size={32} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all campus resources</p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={openAddForm}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent-primary)',
            color: '#fff', fontWeight: 600, borderRadius: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
        >
          <Plus size={20} /> Add Resource
        </motion.button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem',
            border: '1px solid var(--border-color)', marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{isEditing ? 'Edit Resource' : 'Add New Resource'}</h2>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Capacity</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} required
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: 'var(--success)', color: '#fff', fontWeight: 600, borderRadius: '0.5rem' }}>
                Save Resource
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Resource Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Capacity</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{resource.name}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{resource.location}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{resource.capacity}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, 
                    backgroundColor: resource.status?.toLowerCase() === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: resource.status?.toLowerCase() === 'available' ? 'var(--success)' : 'var(--danger)' }}>
                    {resource.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEditForm(resource)} style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '0.5rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(resource._id)} style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
