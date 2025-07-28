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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {slotsData.slots.map((slot) => (
        <SlotCard
          key={slot.id}
          slot={slot}
          userEmail={userEmail}
          loading={loading}
          onSlotAction={onSlotAction}
        />
      ))}
    </div>
  );
};

export default SlotsGrid;
