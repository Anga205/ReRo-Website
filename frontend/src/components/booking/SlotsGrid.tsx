import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SlotCard from './SlotCard';
import type { SlotsData, Slot } from '../../types';

interface SlotsGridProps {
  slotsData: SlotsData | null;
  userEmail: string | undefined;
  loading: number | null;
  onSlotAction: (slot: Slot) => void;
}

const SlotsGrid: React.FC<SlotsGridProps> = ({ slotsData, userEmail, loading, onSlotAction }) => {
  if (!slotsData) {
    return (
      <Box className="text-center py-16">
        <CircularProgress size={60} sx={{ color: '#60a5fa' }} />
        <Typography variant="h6" className="mt-4 text-slate-400">
          Loading slots...
        </Typography>
      </Box>
    );
  }

  if (slotsData.slots.length === 0) {
    return (
      <Box className="text-center py-16">
        <Typography variant="h6" className="text-slate-400">
          No slots available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        justifyItems: 'center'
      }}
    >
      {slotsData.slots.map((slot) => (
        <SlotCard
          key={slot.id}
          slot={slot}
          userEmail={userEmail}
          loading={loading}
          onSlotAction={onSlotAction}
        />
      ))}
    </Box>
  );
};

export default SlotsGrid;
