import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, CircularProgress } from '@mui/material';
import type { Slot } from '../../types';

interface SlotCardProps {
  slot: Slot;
  userEmail: string | undefined;
  loading: number | null;
  onSlotAction: (slot: Slot) => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, userEmail, loading, onSlotAction }) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getSlotStatus = (slot: Slot) => {
    if (slot.is_booked) {
      if (slot.booked_by === userEmail) {
        return 'mine';
      }
      return 'booked';
    }
    return 'available';
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-900/30 border-green-500 hover:bg-green-800/40 hover:border-green-400 shadow-green-500/20';
      case 'booked':
        return 'bg-gray-700/50 border-gray-500 cursor-not-allowed opacity-60';
      case 'mine':
        return 'bg-red-900/30 border-red-500 hover:bg-red-800/40 hover:border-red-400 shadow-red-500/20';
      default:
        return 'bg-gray-800/50 border-gray-600';
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
        return <Chip label="Available" sx={{ backgroundColor: '#22c55e', color: 'white' }} size="small" />;
      case 'mine':
        return <Chip label="Your Booking" sx={{ backgroundColor: '#ef4444', color: 'white' }} size="small" />;
      case 'booked':
        return <Chip label="Booked" sx={{ backgroundColor: '#6b7280', color: 'white' }} size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const status = getSlotStatus(slot);
  const isDisabled = status === 'booked' || loading === slot.id;

  return (
    <Card
      className={`transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 shadow-lg ${getSlotColor(status)} ${
        isDisabled ? 'cursor-not-allowed' : 'hover:shadow-xl'
      }`}
      onClick={() => !isDisabled && onSlotAction(slot)}
      sx={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent className="p-6 text-center flex-grow flex flex-col justify-between">
        <Box>
          <Typography variant="h5" className="font-bold text-slate-100 mb-3">
            {formatTime(slot.start_time)}
          </Typography>
          <Typography variant="h6" className="text-slate-300 mb-4">
            {formatTime(slot.end_time)}
          </Typography>
          
          <Box className="mb-4">
            {getStatusChip(status)}
          </Box>

          {slot.is_booked && slot.booked_by && (
            <Typography variant="body2" className="text-slate-400 mb-3">
              {slot.booked_by === userEmail ? 'Booked by you' : 'Booked by another user'}
            </Typography>
          )}
        </Box>

        <Button
          variant={status === 'available' ? 'contained' : status === 'mine' ? 'outlined' : 'contained'}
          fullWidth
          disabled={isDisabled}
          className="font-semibold py-3 mt-4"
          sx={{
            backgroundColor: status === 'available' ? '#22c55e' : status === 'mine' ? 'transparent' : '#6b7280',
            color: status === 'mine' ? '#ef4444' : 'white',
            borderColor: status === 'mine' ? '#ef4444' : 'transparent',
            '&:hover': {
              backgroundColor: status === 'available' ? '#16a34a' : status === 'mine' ? '#7f1d1d' : '#6b7280',
              borderColor: status === 'mine' ? '#dc2626' : 'transparent',
            },
            '&:disabled': {
              backgroundColor: '#4b5563',
              color: '#9ca3af',
            },
          }}
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
};

export default SlotCard;
