import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getSlotStatus = (slot: Slot) => {
    if (slot.is_booked) {
      if (slot.booked_by === user?.email) {
        return 'mine';
      }
      return 'booked';
    }
    return 'available';
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400';
      case 'booked':
        return 'bg-red-100 border-red-300';
      case 'mine':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200 hover:border-blue-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Book Slot';
      case 'mine':
        return 'Cancel Booking';
      case 'booked':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'available':
        return <Chip label="Available" color="success" size="small" />;
      case 'mine':
        return <Chip label="Your Booking" color="primary" size="small" />;
      case 'booked':
        return <Chip label="Booked" color="error" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  if (!isAuthenticated) {
    return <CircularProgress />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static" className="bg-blue-600 shadow-lg">
        <Toolbar>
          <Typography variant="h6" className="flex-grow font-semibold">
            ReRo Slot Booking
          </Typography>
          <Box className="flex items-center space-x-4">
            <Typography variant="body2" className="text-blue-100">
              Welcome, {user?.email}
            </Typography>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <Typography variant="body2" className="text-blue-100">
                {isConnected ? 'Connected' : 'Disconnected'}
              </Typography>
            </div>
            <Button
              color="inherit"
              onClick={handleLogout}
              className="text-white hover:bg-blue-700"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-8">
        <Box className="text-center mb-8">
          <Typography variant="h3" className="font-bold text-gray-800 mb-2">
            Available Time Slots
          </Typography>
          <Typography variant="h6" className="text-gray-600 mb-4">
            Select your preferred time slot (3:00 AM - 3:00 PM)
          </Typography>
          
          <Box className="flex justify-center space-x-4 mb-6">
            <Box className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 border border-green-300 rounded" />
              <Typography variant="body2">Available</Typography>
            </Box>
            <Box className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded" />
              <Typography variant="body2">Your Booking</Typography>
            </Box>
            <Box className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded" />
              <Typography variant="body2">Booked by Others</Typography>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg">
            {error}
          </Alert>
        )}

        {!isConnected && (
          <Alert severity="warning" className="mb-6 rounded-lg">
            Connection lost. Attempting to reconnect...
          </Alert>
        )}

        {slotsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {slotsData.slots.map((slot) => {
              const status = getSlotStatus(slot);
              const isDisabled = status === 'booked' || loading === slot.id;
              
              return (
                <Card
                  key={slot.id}
                  className={`transition-all duration-200 transform hover:scale-105 cursor-pointer border-2 ${getSlotColor(status)} ${
                    isDisabled ? 'opacity-60' : ''
                  }`}
                  onClick={() => !isDisabled && handleSlotAction(slot)}
                >
                  <CardContent className="p-6 text-center">
                    <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </Typography>
                    
                    <Box className="mb-4">
                      {getStatusChip(status)}
                    </Box>

                    {slot.is_booked && slot.booked_by && (
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        {slot.booked_by === user?.email ? 'Booked by you' : 'Booked by another user'}
                      </Typography>
                    )}

                    <Button
                      variant={status === 'available' ? 'contained' : status === 'mine' ? 'outlined' : 'contained'}
                      color={status === 'available' ? 'success' : status === 'mine' ? 'primary' : 'error'}
                      fullWidth
                      disabled={isDisabled}
                      className={`font-semibold py-2 ${
                        status === 'available'
                          ? 'bg-green-600 hover:bg-green-700'
                          : status === 'mine'
                          ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          : 'bg-gray-400'
                      }`}
                    >
                      {loading === slot.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        getButtonText(status)
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Box className="text-center py-16">
            <CircularProgress size={60} />
            <Typography variant="h6" className="mt-4 text-gray-600">
              Loading slots...
            </Typography>
          </Box>
        )}

        {slotsData && slotsData.slots.length === 0 && (
          <Box className="text-center py-16">
            <Typography variant="h6" className="text-gray-600">
              No slots available at the moment.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SlotBooking;
