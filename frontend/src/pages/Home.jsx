import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Users, CheckCircle, Clock, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fallback mock data in case backend is empty
        const mockData = [
          { _id: '1', name: 'Main Auditorium', capacity: 500, location: 'Building A', status: 'Available' },
          { _id: '2', name: 'Conference Room B', capacity: 20, location: 'Building B', status: 'Available' },
          { _id: '3', name: 'Computer Lab 1', capacity: 40, location: 'Building C', status: 'Maintenance' },
        ];
        
        const res = await axios.get('/api/resources');
        setResources(res.data.length > 0 ? res.data : mockData);
      } catch (error) {
        console.error("Error fetching resources", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleBook = (resourceId) => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login first to book a resource.' } });
    } else {
      // In a full implementation, this would open a booking modal
      alert(`Booking functionality for resource ${resourceId} would open here.`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.05em' }}>
          Discover <span className="gradient-text">Campus Spaces</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
          Browse and reserve auditoriums, conference rooms, and labs across the campus with ease.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '3rem', position: 'relative', maxWidth: '600px', margin: '0 auto 3rem auto' }}
      >
        <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search resources by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-primary)';
            e.target.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
          }}
        />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {filteredResources.map((resource) => (
          <motion.div 
            key={resource._id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)' }}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              transition: 'background-color 0.3s'
            }}
          >
            <div style={{ height: '160px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <CheckCircle size={48} color="rgba(255,255,255,0.1)" />
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{resource.name}</h3>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  backgroundColor: resource.status?.toLowerCase() === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: resource.status?.toLowerCase() === 'available' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {resource.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> {resource.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} /> Capacity: {resource.capacity} people
                </div>
              </div>
              
              <button
                onClick={() => handleBook(resource._id)}
                disabled={resource.status?.toLowerCase() !== 'available'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: resource.status?.toLowerCase() === 'available' ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: resource.status?.toLowerCase() === 'available' ? '#fff' : 'var(--text-secondary)',
                  cursor: resource.status?.toLowerCase() === 'available' ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if(resource.status?.toLowerCase() === 'available') e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
                }}
                onMouseOut={(e) => {
                  if(resource.status?.toLowerCase() === 'available') e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
                }}
              >
                <Clock size={18} />
                {resource.status?.toLowerCase() === 'available' ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
