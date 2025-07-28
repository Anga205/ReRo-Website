import React from 'react';
import { Typography, Box } from '@mui/material';

const BookingHeader: React.FC = () => {
  return (
    <Box className="text-center mb-8">
      <Typography variant="h2" className="font-bold text-slate-100 mb-3">
        Time Slot Booking
      </Typography>
      <Typography variant="h6" className="text-slate-400 mb-6">
        Select your preferred time slot • 3:00 AM - 3:00 PM
      </Typography>
      
      <Box className="flex justify-center space-x-8 mb-8">
        <Box className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-green-500 border border-green-400 rounded shadow-green-500/20 shadow-md" />
          <Typography variant="body1" className="text-slate-300 font-medium">Available</Typography>
        </Box>
        <Box className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-red-500 border border-red-400 rounded shadow-red-500/20 shadow-md" />
          <Typography variant="body1" className="text-slate-300 font-medium">Your Bookings</Typography>
        </Box>
        <Box className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-500 border border-gray-400 rounded" />
          <Typography variant="body1" className="text-slate-300 font-medium">Unavailable</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingHeader;
