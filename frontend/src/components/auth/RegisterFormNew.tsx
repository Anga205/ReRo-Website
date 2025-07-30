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

interface RegisterFormProps {
  onSubmit: (email: string, password: string, confirmPassword: string) => Promise<void>;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, confirmPassword);
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
                borderColor: '#34d399',
                boxShadow: '0 0 0 3px rgba(52, 211, 153, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#34d399',
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

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          helperText="Password must be at least 6 characters long"
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
                borderColor: '#34d399',
                boxShadow: '0 0 0 3px rgba(52, 211, 153, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#34d399',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: '#f3f4f6',
              padding: '16px 14px',
              fontSize: '1rem',
            },
            '& .MuiFormHelperText-root': {
              color: '#9ca3af',
              marginLeft: '14px',
              marginTop: '8px',
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
                    '&:hover': { color: '#34d399' }
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
                borderColor: '#34d399',
                boxShadow: '0 0 0 3px rgba(52, 211, 153, 0.1)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': {
                color: '#34d399',
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
          borderRadius: '12px',
          padding: '16px 0',
          fontSize: '1.1rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 10px 30px rgba(52, 211, 153, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': { 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 40px rgba(52, 211, 153, 0.4)',
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
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
