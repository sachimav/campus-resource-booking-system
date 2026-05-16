import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const BookingModal = ({ resource, onClose }) => {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('/api/bookings', {
        userName: user?.email?.split('@')[0] || 'Unknown User',
        resourceId: resource._id,
        date,
        startTime,
        endTime
      });

      setStatus({ type: 'success', message: 'Booking successful!' });
      
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      // Show the error message from the backend (e.g., "Resource already booked for this time")
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to book resource. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '1rem'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '1.5rem',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            padding: '1.5rem 2rem', 
            borderBottom: '1px solid var(--border-color)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Book Resource</h2>
            <button 
              onClick={onClose}
              style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Booking</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{resource.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Location: {resource.location}</p>
            </div>

            {status.message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  marginBottom: '1.5rem', 
                  fontSize: '0.875rem', 
                  textAlign: 'center',
                  fontWeight: 500,
                  backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                  color: status.type === 'error' ? 'var(--danger)' : 'var(--success)',
                  border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                }}
              >
                {status.message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Date
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                      backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)', borderRadius: '0.5rem',
                      outline: 'none', transition: 'border-color 0.2s',
                      colorScheme: 'dark' // Ensures date picker icon is visible in dark mode
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Start Time
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                      <Clock size={18} />
                    </div>
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '0.875rem 0.5rem 0.875rem 2.5rem',
                        backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)', borderRadius: '0.5rem',
                        outline: 'none', transition: 'border-color 0.2s',
                        colorScheme: 'dark'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    End Time
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                      <Clock size={18} />
                    </div>
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '0.875rem 0.5rem 0.875rem 2.5rem',
                        backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)', borderRadius: '0.5rem',
                        outline: 'none', transition: 'border-color 0.2s',
                        colorScheme: 'dark'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || status.type === 'success'}
                style={{
                  padding: '1rem',
                  backgroundColor: status.type === 'success' ? 'var(--success)' : 'var(--accent-primary)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  opacity: (isSubmitting || status.type === 'success') ? 0.7 : 1,
                  cursor: (isSubmitting || status.type === 'success') ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if(!isSubmitting && status.type !== 'success') e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
                }}
                onMouseOut={(e) => {
                  if(!isSubmitting && status.type !== 'success') e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
                }}
              >
                {isSubmitting ? 'Processing...' : status.type === 'success' ? 'Booked Successfully' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
