import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box className="text-center py-20">
          <Typography variant="h2" className="font-bold text-gray-800 mb-4">
            ReRo Slot Booking
          </Typography>
          <Typography variant="h5" className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your preferred time slots seamlessly with real-time updates and secure authentication
          </Typography>
          
          {isAuthenticated ? (
            <Box className="space-y-4">
              <Typography variant="h6" className="text-blue-600 mb-4">
                Welcome back, {user?.email}!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-lg"
                sx={{
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Go to Booking
              </Button>
            </Box>
          ) : (
            <Box className="space-x-4">
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-lg mr-4"
                sx={{
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                  padding: '12px 32px',
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
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-lg"
                sx={{
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': { backgroundColor: '#eff6ff', borderColor: '#1d4ed8' },
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Create Account
              </Button>
            </Box>
          )}
        </Box>

        {/* Features Section */}
        <Box className="py-16">
          <Typography variant="h3" className="text-center font-bold text-gray-800 mb-12">
            Features
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent>
                <div className="mb-4">
                  <span className="text-5xl">⚡</span>
                </div>
                <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
                  Real-time Updates
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  See slot availability updates instantly with WebSocket technology. No need to refresh!
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent>
                <div className="mb-4">
                  <span className="text-5xl">🔐</span>
                </div>
                <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
                  Secure Authentication
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Your account is protected with bcrypt password hashing and secure local authentication.
                </Typography>
              </CardContent>
            </Card>

            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent>
                <div className="mb-4">
                  <span className="text-5xl">📅</span>
                </div>
                <Typography variant="h5" className="font-semibold text-gray-800 mb-3">
                  Easy Booking
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Book and cancel slots with just one click. Manage your bookings effortlessly.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Box>

        {/* Time Slots Info */}
        <Box className="py-16 bg-white rounded-2xl shadow-lg mb-16">
          <Container>
            <Typography variant="h3" className="text-center font-bold text-gray-800 mb-8">
              Available Time Slots
            </Typography>
            <Typography variant="h6" className="text-center text-gray-600 mb-8">
              Choose from 12 hourly slots between 3:00 AM and 3:00 PM
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM',
                '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'
              ].map((time, index) => (
                <Box
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
                >
                  <Typography variant="body1" className="font-semibold text-blue-800">
                    {time}
                  </Typography>
                </Box>
              ))}
            </div>
          </Container>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
