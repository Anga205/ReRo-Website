import React from 'react';
import { Typography, Box } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const LoginHeader: React.FC = () => {
  return (
    <Box className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
        <LoginIcon className="text-blue-400 text-3xl" />
      </div>
      <Typography variant="h4" className="font-bold text-slate-100 mb-2">
        Welcome Back
      </Typography>
      <Typography variant="body1" className="text-slate-400">
        Sign in to your account to book slots
      </Typography>
    </Box>
  );
};

export default LoginHeader;
