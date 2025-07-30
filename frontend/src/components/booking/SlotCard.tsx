import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
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
        return 'mine'; // Red - our booking, can cancel
      }
      return 'booked'; // Gray - booked by someone else
    }
    return 'available'; // Green - available to book
  };

  const getSlotColors = (status: string) => {
    switch (status) {
      case 'available':
        return {
          backgroundColor: '#28A745',
          hoverColor: '#1e7e34'
        };
      case 'mine':
        return {
          backgroundColor: '#B00020',
          hoverColor: '#8b001a'
        };
      case 'booked':
        return {
          backgroundColor: '#6b7280',
          hoverColor: '#6b7280'
        };
      default:
        return {
          backgroundColor: '#6b7280',
          hoverColor: '#6b7280'
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available - Click to Book';
      case 'mine':
        return 'Booked';
      case 'booked':
        return 'Booked';
      default:
        return 'Unavailable';
    }
  };

  const status = getSlotStatus(slot);
  const colors = getSlotColors(status);
  const isClickable = status === 'available' || status === 'mine';
  const isLoading = loading === slot.id;

  return (
    <Box
      onClick={() => isClickable && !isLoading && onSlotAction(slot)}
      sx={{
        width: '140px',
        height: '60px',
        backgroundColor: colors.backgroundColor,
        borderRadius: '8px',
        cursor: isClickable ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': isClickable ? {
          backgroundColor: colors.hoverColor,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        } : {}
      }}
    >
      {isLoading ? (
        <CircularProgress size={20} sx={{ color: 'white' }} />
      ) : (
        <>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              lineHeight: 1.2,
              textAlign: 'center',
              marginBottom: '2px'
            }}
          >
            {formatTime(slot.start_time)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontSize: '0.75rem',
              lineHeight: 1.1,
              textAlign: 'center',
              fontWeight: '400',
              opacity: 0.9
            }}
          >
            {getStatusText(status)}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default SlotCard;
