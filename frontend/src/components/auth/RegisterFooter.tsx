import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const RegisterFooter: React.FC = () => {
  return (
    <Box className="text-center mt-6 pt-4 border-t border-slate-700">
      <Typography variant="body2" className="text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-green-400 hover:text-green-300 font-semibold hover:underline transition-colors"
        >
          Sign in here
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterFooter;
