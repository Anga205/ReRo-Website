import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import RegisterHeader from '../components/auth/RegisterHeader';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterFooter from '../components/auth/RegisterFooter';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/booking');
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress />
            <span className="text-slate-400">Loading...</span>
          </Box>
        </div>
      </div>
    );
  }

  const handleSubmit = async (email: string, password: string, confirmPassword: string) => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const success = await register(email, password);
      if (success) {
        navigate('/booking');
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              p: { xs: 4, sm: 6 },
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            <RegisterHeader />

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 29, 29, 0.9)', 
                  color: '#fecaca',
                  border: '1px solid #991b1b',
                  '& .MuiAlert-icon': {
                    color: '#f87171'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <RegisterForm onSubmit={handleSubmit} loading={loading} />

            <RegisterFooter />
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Register;
