import React from 'react';
import { Typography, Box } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';

const RegisterHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
          borderRadius: '50%',
          mb: 3,
          boxShadow: '0 10px 30px rgba(52, 211, 153, 0.3)',
        }}
      >
        <PersonAddIcon sx={{ fontSize: 36, color: 'white' }} />
      </Box>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          fontSize: { xs: '1.8rem', sm: '2.5rem' }
        }}
      >
        Create Account
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#94a3b8',
          fontSize: '1.1rem',
          fontWeight: 400
        }}
      >
        Join the future of robotics education
      </Typography>
    </Box>
  );
};

export default RegisterHeader;
