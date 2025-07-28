import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

interface AppHeaderProps {
  userEmail: string;
  isConnected: boolean;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userEmail, isConnected, onLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
      <Toolbar className="py-2">
        <Typography variant="h6" className="flex-grow font-bold text-slate-100">
          🎯 ReRo Slot Booking
        </Typography>
        <Box className="flex items-center space-x-6">
          <Typography variant="body2" className="text-slate-300">
            Welcome, <span className="font-semibold text-blue-300">{userEmail}</span>
          </Typography>
          <Box className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <Typography variant="body2" className="text-slate-300 text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={onLogout}
            className="text-slate-300 hover:bg-slate-700 px-4 py-2"
            sx={{ 
              color: '#cbd5e1',
              '&:hover': { backgroundColor: '#374151' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
