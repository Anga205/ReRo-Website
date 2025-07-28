import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => {
  return (
    <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-800/50 border border-slate-700">
      <CardContent>
        <div className="mb-4">
          <span className="text-5xl">{icon}</span>
        </div>
        <Typography variant="h5" className="font-semibold text-slate-100 mb-3">
          {title}
        </Typography>
        <Typography variant="body1" className="text-slate-400">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'See slot availability updates instantly with WebSocket technology. No need to refresh!'
    },
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Your account is protected with bcrypt password hashing and secure local authentication.'
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description: 'Book and cancel slots with just one click. Manage your bookings effortlessly.'
    }
  ];

  return (
    <Box className="py-16">
      <Typography variant="h3" className="text-center font-bold text-slate-100 mb-12">
        Features
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </Box>
  );
};

export default FeaturesSection;
