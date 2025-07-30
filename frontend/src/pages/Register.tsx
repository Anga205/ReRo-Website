import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
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
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="sm">
          <Card className="shadow-2xl rounded-2xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <RegisterHeader />

              {error && (
                <Alert severity="error" className="mb-4 rounded-lg" sx={{ 
                  backgroundColor: '#7f1d1d', 
                  color: '#fecaca',
                  border: '1px solid #991b1b'
                }}>
                  {error}
                </Alert>
              )}

              <RegisterForm onSubmit={handleSubmit} loading={loading} />

              <RegisterFooter />
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Register;
