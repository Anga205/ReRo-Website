import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const LoginFooter: React.FC = () => {
  return (
    <Box className="text-center mt-6 pt-4 border-t border-slate-700">
      <Typography variant="body2" className="text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
        >
          Create one here
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginFooter;
