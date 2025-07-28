import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        variant="outlined"
        className="mb-4"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#334155',
            '& fieldset': {
              borderColor: '#64748b',
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60a5fa',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
          },
          '& .MuiOutlinedInput-input': {
            color: '#f1f5f9',
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        variant="outlined"
        className="mb-6"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#334155',
            '& fieldset': {
              borderColor: '#64748b',
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60a5fa',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
          },
          '& .MuiOutlinedInput-input': {
            color: '#f1f5f9',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
                sx={{ color: '#94a3b8' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        className="py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]"
        sx={{
          backgroundColor: '#3b82f6',
          '&:hover': { backgroundColor: '#2563eb' },
          padding: '14px 0',
          fontSize: '1.1rem',
          fontWeight: 600,
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
