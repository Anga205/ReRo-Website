import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(55, 65, 81, 0.8)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '& fieldset': {
                borderColor: '#4b5563',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: '#6b7280',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#60a5fa',
                boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#60a5fa',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: '#f3f4f6',
              padding: '16px 14px',
              fontSize: '1rem',
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(55, 65, 81, 0.8)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '& fieldset': {
                borderColor: '#4b5563',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: '#6b7280',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#60a5fa',
                boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#60a5fa',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: '#f3f4f6',
              padding: '16px 14px',
              fontSize: '1rem',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                  sx={{ 
                    color: '#9ca3af',
                    '&:hover': { color: '#60a5fa' }
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          borderRadius: '12px',
          padding: '16px 0',
          fontSize: '1.1rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 10px 30px rgba(96, 165, 250, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': { 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 40px rgba(96, 165, 250, 0.4)',
          },
          '&:disabled': {
            background: '#4b5563',
            transform: 'none',
            boxShadow: 'none',
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
