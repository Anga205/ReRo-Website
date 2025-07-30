import React from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const { isInitialized } = useAuth();

  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <span className="text-slate-400">Loading...</span>
        </Box>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      {/* Main Content */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 64px)', // Subtract navbar height
            textAlign: 'center',
            px: 2
          }}
        >
          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
              fontWeight: 700,
              background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              lineHeight: 1.1
            }}
          >
            Remote Robotics (ReRo) Lab
          </Typography>
          
          {/* Subtitle */}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem', lg: '2rem' },
              fontWeight: 400,
              color: '#cbd5e1',
              mb: 6,
              maxWidth: '800px',
              lineHeight: 1.4
            }}
          >
            India's First 24/7 Virtual Robotics Lab by an Educational Institution
          </Typography>
          
          {/* Optional decorative elements */}
          <Box
            sx={{
              width: 100,
              height: 4,
              background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
              borderRadius: 2,
              mb: 4
            }}
          />
          
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: '#94a3b8',
              maxWidth: '600px',
              lineHeight: 1.6
            }}
          >
            Experience hands-on robotics learning from anywhere in the world. 
            Our state-of-the-art virtual lab provides 24/7 access to real Arduino-based 
            robotic systems for students, researchers, and enthusiasts.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
