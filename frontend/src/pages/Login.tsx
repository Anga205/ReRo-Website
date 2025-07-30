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
import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';
import LoginFooter from '../components/auth/LoginFooter';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, isInitialized } = useAuth();
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

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/booking');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
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
              <LoginHeader />

              {error && (
                <Alert severity="error" className="mb-4 rounded-lg" sx={{ 
                  backgroundColor: '#7f1d1d', 
                  color: '#fecaca',
                  border: '1px solid #991b1b'
                }}>
                  {error}
                </Alert>
              )}

              <LoginForm onSubmit={handleSubmit} loading={loading} />

              <LoginFooter />
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Login;
