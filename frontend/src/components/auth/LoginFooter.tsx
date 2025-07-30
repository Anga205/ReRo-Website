import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Divider } from '@mui/material';

const LoginFooter: React.FC = () => {
  return (
    <Box className="mt-8">
      <Divider sx={{ 
        borderColor: 'rgba(75, 85, 99, 0.3)', 
        mb: 6 
      }} />
      
      <Box className="text-center">
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#9ca3af',
            fontSize: '0.95rem',
            fontWeight: 400,
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className="inline-block"
            style={{
              color: '#60a5fa',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#93c5fd';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#60a5fa';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Create one here
          </Link>
        </Typography>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#6b7280',
            fontSize: '0.8rem',
            display: 'block',
            mt: 3,
            fontStyle: 'italic'
          }}
        >
          Secure access to Remote Robotics Lab
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginFooter;
