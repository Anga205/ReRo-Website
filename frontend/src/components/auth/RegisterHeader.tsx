import React from 'react';
import { Typography, Box } from '@mui/material';

const RegisterHeader: React.FC = () => {
  return (
    <Box className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
        <span className="text-green-400 text-3xl">👤</span>
      </div>
      <Typography variant="h4" className="font-bold text-slate-100 mb-2">
        Create Account
      </Typography>
      <Typography variant="body1" className="text-slate-400">
        Join us to start booking slots
      </Typography>
    </Box>
  );
};

export default RegisterHeader;
