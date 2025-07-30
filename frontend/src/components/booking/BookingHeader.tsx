import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const BookingHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box className="text-center mb-8" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography 
        variant="h4" 
        className="font-bold text-white mb-4"
        sx={{ 
          fontSize: '1.25rem',
          textAlign: 'center'
        }}
      >
        Welcome, {user?.email || 'User'}
      </Typography>
      
      <Box className="mb-8">
        <Chip
          label="Online"
          sx={{
            backgroundColor: '#28A745',
            color: 'white',
            fontWeight: 'medium',
            borderRadius: '20px',
            padding: '4px 12px'
          }}
        />
      </Box>
    </Box>
  );
};

export default BookingHeader;
