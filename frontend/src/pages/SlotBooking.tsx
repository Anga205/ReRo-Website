import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import Navbar from '../components/Navbar';
import BookingHeader from '../components/booking/BookingHeader';
import StatusAlerts from '../components/booking/StatusAlerts';
import SlotsGrid from '../components/booking/SlotsGrid';
import type { Slot } from '../types';

const SlotBooking: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { slotsData, isConnected, error, bookSlot, cancelSlot } = useWebSocket();
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="flex flex-col items-center gap-4">
            <CircularProgress />
            <span className="text-slate-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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

  if (!isAuthenticated) {
    return <CircularProgress />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div style={{ width: '100%', padding: '2rem 1rem' }}>
        <BookingHeader />
        
        <StatusAlerts error={error} isConnected={isConnected} />

        <SlotsGrid
          slotsData={slotsData}
          userEmail={user?.email}
          loading={loading}
          onSlotAction={handleSlotAction}
        />
      </div>
    </div>
  );
};

export default SlotBooking;
