import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';

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
              borderColor: '#34d399',
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
        className="mb-4"
        helperText="Password must be at least 6 characters long"
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
              borderColor: '#34d399',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
          },
          '& .MuiOutlinedInput-input': {
            color: '#f1f5f9',
          },
          '& .MuiFormHelperText-root': {
            color: '#94a3b8',
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
                {showPassword ? <span>🙈</span> : <span>👁️</span>}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
              borderColor: '#34d399',
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        className="py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]"
        sx={{
          backgroundColor: '#10b981',
          '&:hover': { backgroundColor: '#059669' },
          padding: '14px 0',
          fontSize: '1.1rem',
          fontWeight: 600,
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
