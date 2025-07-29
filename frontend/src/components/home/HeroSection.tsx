import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

interface HeroSectionProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated, userEmail, onGetStarted }) => {
  return (
    <Box className="text-center py-20">
      <Typography variant="h2" className="font-bold text-slate-100 mb-4">
        🎯 ReRo Slot Booking
      </Typography>
      <Typography variant="h5" className="text-slate-400 mb-8 max-w-2xl mx-auto">
        Book your preferred time slots seamlessly with real-time updates and secure authentication
      </Typography>
      
      {isAuthenticated ? (
        <Box className="space-y-4">
          <Typography variant="h6" className="text-blue-400 mb-4">
            Welcome back, <span className="font-semibold">{userEmail}</span>!
          </Typography>
          <Box className="space-x-4">
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              className="px-8 py-3 text-lg font-semibold rounded-lg"
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                padding: '14px 32px',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Go to Booking
            </Button>
            <Button
              component={Link}
              to="/arduino"
              variant="outlined"
              size="large"
              className="px-8 py-3 text-lg font-semibold rounded-lg"
              sx={{
                borderColor: '#10b981',
                color: '#34d399',
                '&:hover': { 
                  backgroundColor: '#10b98120', 
                  borderColor: '#059669',
                  color: '#6ee7b7'
                },
                padding: '14px 32px',
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Arduino Editor
            </Button>
          </Box>
        </Box>
      ) : (
        <Box className="space-x-4">
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            className="px-8 py-3 text-lg font-semibold rounded-lg mr-4"
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' },
              padding: '14px 32px',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            className="px-8 py-3 text-lg font-semibold rounded-lg"
            sx={{
              borderColor: '#3b82f6',
              color: '#60a5fa',
              '&:hover': { 
                backgroundColor: '#1e3a8a20', 
                borderColor: '#2563eb',
                color: '#93c5fd'
              },
              padding: '14px 32px',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Create Account
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
