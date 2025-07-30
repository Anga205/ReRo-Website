import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import BlogPage from '../../components/BlogPage';

const GettingStarted: React.FC = () => {
  return (
    <BlogPage title="Getting Started with Remote Robotics">
      <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
        Welcome to the Future of Robotics Education
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        The Remote Robotics (ReRo) Lab represents a revolutionary approach to robotics education. 
        Our virtual lab allows students and researchers to interact with real robotic systems 
        remotely, breaking down geographical barriers and providing 24/7 access to cutting-edge equipment.
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        What You Can Do:
      </Typography>
      
      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="Control Real Arduino-based Robots"
            secondary="Program and control actual hardware remotely through our web interface"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="24/7 Lab Access"
            secondary="Book time slots and access the lab anytime, from anywhere in the world"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Real-time Feedback"
            secondary="See your code execute on real hardware with live video feeds and sensor data"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Collaborative Learning"
            secondary="Share your experiments and learn from others in our community"
          />
        </ListItem>
      </List>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Getting Started:
      </Typography>
      
      <Box component="ol" sx={{ pl: 2 }}>
        <li>Create an account and log in</li>
        <li>Book a time slot for your experiment</li>
        <li>Access the Arduino programming interface</li>
        <li>Upload your code and see it run on real hardware</li>
        <li>Analyze results and iterate on your design</li>
      </Box>
    </BlogPage>
  );
};

export default GettingStarted;
