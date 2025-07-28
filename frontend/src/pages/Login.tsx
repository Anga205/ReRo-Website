import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';
import LoginFooter from '../components/auth/LoginFooter';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Card className="shadow-2xl rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
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
  );
};

export default Login;
