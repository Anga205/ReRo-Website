import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TimeSlotsInfo from '../components/home/TimeSlotsInfo';

const Home: React.FC = () => {
  const { isAuthenticated, user, isInitialized } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress />
          <span className="text-slate-400">Loading...</span>
        </Box>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Container maxWidth="lg">
        <HeroSection 
          isAuthenticated={isAuthenticated}
          userEmail={user?.email}
          onGetStarted={handleGetStarted}
        />
        
        <FeaturesSection />
        
        <TimeSlotsInfo />
      </Container>
    </div>
  );
};

export default Home;
