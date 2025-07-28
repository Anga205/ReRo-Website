import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import AppHeader from '../components/booking/AppHeader';
import BookingHeader from '../components/booking/BookingHeader';
import StatusAlerts from '../components/booking/StatusAlerts';
import SlotsGrid from '../components/booking/SlotsGrid';
import type { Slot } from '../types';

const SlotBooking: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { slotsData, isConnected, error, bookSlot, cancelSlot } = useWebSocket();
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSlotAction = async (slot: Slot) => {
    if (loading) return;
    
    setLoading(slot.id);
    
    try {
      if (slot.is_booked && slot.booked_by === user?.email) {
        // Cancel slot
        cancelSlot(slot.id);
      } else if (!slot.is_booked) {
        // Book slot
        bookSlot(slot.id);
      }
    } catch (err) {
      console.error('Slot action error:', err);
    }
    
    // Clear loading state after a short delay
    setTimeout(() => setLoading(null), 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <CircularProgress />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AppHeader
        userEmail={user?.email || ''}
        isConnected={isConnected}
        onLogout={handleLogout}
      />

      <Container maxWidth="xl" className="py-8">
        <BookingHeader />
        
        <StatusAlerts error={error} isConnected={isConnected} />

        <SlotsGrid
          slotsData={slotsData}
          userEmail={user?.email}
          loading={loading}
          onSlotAction={handleSlotAction}
        />
      </Container>
    </div>
  );
};

export default SlotBooking;
