import React from 'react';
import { Alert } from '@mui/material';

interface StatusAlertsProps {
  error: string | null;
  isConnected: boolean;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({ error, isConnected }) => {
  return (
    <>
      {error && (
        <Alert severity="error" className="mb-6 rounded-lg" sx={{ backgroundColor: '#7f1d1d', color: '#fecaca' }}>
          {error}
        </Alert>
      )}

      {!isConnected && (
        <Alert severity="warning" className="mb-6 rounded-lg" sx={{ backgroundColor: '#78350f', color: '#fed7aa' }}>
          Connection lost. Attempting to reconnect...
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;
