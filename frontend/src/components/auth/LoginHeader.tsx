import React from 'react';
import { Typography, Box } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const LoginHeader: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          borderRadius: '50%',
          mb: 3,
          boxShadow: '0 10px 30px rgba(96, 165, 250, 0.3)',
        }}
      >
        <LoginIcon sx={{ fontSize: 36, color: 'white' }} />
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
        Welcome Back
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#94a3b8',
          fontSize: '1.1rem',
          fontWeight: 400
        }}
      >
        Access your remote robotics lab
      </Typography>
    </Box>
  );
};

export default LoginHeader;
