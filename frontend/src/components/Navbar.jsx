import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Calendar, BookOpen, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Calendar size={28} color="var(--accent-primary)" />
          </motion.div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Campus<span className="gradient-text">Book</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontWeight: 500, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-hover)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--accent-primary)'}>
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}
              <Link to="/bookings" style={{ fontWeight: 500, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}>
                <BookOpen size={18} /> My Bookings
              </Link>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                <User size={18} /> {user.email.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
                  fontWeight: 500, transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
                fontWeight: 500, color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                Login
              </Link>
              <Link to="/register" style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
                fontWeight: 500, color: '#fff',
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.23)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)';
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
