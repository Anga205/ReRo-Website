import React from 'react';
import { Typography, Box, Container } from '@mui/material';

const TimeSlotsInfo: React.FC = () => {
  const timeSlots = [
    '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM',
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'
  ];

  return (
    <Box className="py-16 bg-slate-800/30 rounded-2xl shadow-lg mb-16 border border-slate-700">
      <Container>
        <Typography variant="h3" className="text-center font-bold text-slate-100 mb-8">
          Available Time Slots
        </Typography>
        <Typography variant="h6" className="text-center text-slate-400 mb-8">
          Choose from 12 hourly slots between 3:00 AM and 3:00 PM
        </Typography>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {timeSlots.map((time, index) => (
            <Box
              key={index}
              className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-center hover:bg-blue-500/30 transition-colors"
            >
              <Typography variant="body1" className="font-semibold text-blue-300">
                {time}
              </Typography>
            </Box>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default TimeSlotsInfo;
