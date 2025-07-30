import React from 'react';
import { Typography, Box, Alert } from '@mui/material';
import BlogPage from '../../components/BlogPage';

const SafetyGuidelines: React.FC = () => {
  return (
    <BlogPage title="Lab Safety Guidelines">
      <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
        Ensuring Safe and Responsible Use of Remote Equipment
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Please read and follow these guidelines carefully to ensure safe operation 
          of our remote robotics equipment and a positive experience for all users.
        </Typography>
      </Alert>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        General Safety Rules:
      </Typography>
      
      <Box component="ul" sx={{ mb: 3, pl: 3 }}>
        <li>Never attempt to damage or misuse the equipment</li>
        <li>Report any malfunctions or issues immediately</li>
        <li>Respect your allocated time slots</li>
        <li>Do not share your login credentials</li>
        <li>Follow all programming guidelines and restrictions</li>
      </Box>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Programming Safety:
      </Typography>
      
      <Box component="ul" sx={{ mb: 3, pl: 3 }}>
        <li>Avoid infinite loops without delays</li>
        <li>Do not exceed voltage/current limits</li>
        <li>Test code thoroughly before deployment</li>
        <li>Use appropriate delay functions</li>
        <li>Monitor serial output for errors</li>
      </Box>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Prohibited Actions:
      </Typography>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        <Box component="ul" sx={{ pl: 3, mb: 0 }}>
          <li>Attempting to hack or bypass system security</li>
          <li>Uploading malicious or destructive code</li>
          <li>Interfering with other users' sessions</li>
          <li>Excessive resource consumption</li>
          <li>Violating intellectual property rights</li>
        </Box>
      </Alert>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Emergency Procedures:
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
        If you notice any equipment malfunction, unusual behavior, or safety concerns:
      </Typography>
      
      <Box component="ol" sx={{ pl: 2, mb: 3 }}>
        <li>Immediately stop your current operation</li>
        <li>Document the issue with screenshots if possible</li>
        <li>Contact the lab administrators</li>
        <li>Do not attempt to fix the issue yourself</li>
      </Box>
      
      <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
        Remember: Our remote lab is a shared resource. Your responsible use ensures 
        that everyone can benefit from this innovative learning platform.
      </Typography>
    </BlogPage>
  );
};

export default SafetyGuidelines;
