import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trash2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings');
        
        // Since the backend currently returns all bookings, we filter them on the client side
        // based on the userName we save during booking (the first part of the email).
        const userName = user.email.split('@')[0];
        const userBookings = res.data.filter(booking => booking.userName === userName);
        
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/api/bookings/${bookingId}`);
        // Remove from UI
        setBookings(bookings.filter(b => b._id !== bookingId));
      } catch (error) {
        alert('Failed to cancel booking. Please try again.');
        console.error("Error canceling booking", error);
      }
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

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '3rem', marginTop: '2rem' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
          My <span className="gradient-text">Bookings</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your reserved campus resources and schedules.
        </p>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <AlertCircle size={48} color="var(--text-secondary)" opacity={0.5} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No bookings found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You haven't reserved any resources yet.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 500,
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
          >
            Browse Resources
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {bookings.map((booking) => (
            <motion.div 
              key={booking._id}
              variants={itemVariants}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                    {booking.resourceId?.name || 'Unknown Resource'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <MapPin size={14} /> {booking.resourceId?.location || 'Unknown Location'}
                  </div>
                </div>

                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem', borderRadius: '0.5rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
                    fontWeight: 500, transition: 'all 0.2s', fontSize: '0.875rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                >
                  <Trash2 size={16} /> Cancel Booking
                </button>
              </div>

              <div style={{ 
                display: 'flex', flexWrap: 'wrap', gap: '1.5rem', 
                padding: '1rem', backgroundColor: 'var(--bg-dark)', 
                borderRadius: '0.5rem', border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--accent-primary)' }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date</p>
                    <p style={{ fontWeight: 500 }}>{booking.date}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--accent-primary)' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Time</p>
                    <p style={{ fontWeight: 500 }}>{booking.startTime} - {booking.endTime}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Bookings;
