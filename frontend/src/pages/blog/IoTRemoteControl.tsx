import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import BlogPage from '../../components/BlogPage';

const IoTRemoteControl: React.FC = () => {
  return (
    <BlogPage title="IoT and Remote Control">
      <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
        Understanding IoT Principles in Remote Robotics
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        Internet of Things (IoT) forms the backbone of our remote robotics platform. 
        Learn how IoT principles enable real-time control and monitoring of robotic systems 
        from anywhere in the world.
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Key IoT Components:
      </Typography>
      
      <List sx={{ mb: 3 }}>
        <ListItem>
          <ListItemText 
            primary="Sensors and Actuators"
            secondary="Physical devices that interact with the environment"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Connectivity"
            secondary="WiFi, Bluetooth, and cellular connections for communication"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Data Processing"
            secondary="Edge computing and cloud processing of sensor data"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="User Interface"
            secondary="Web and mobile interfaces for remote control"
          />
        </ListItem>
      </List>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Remote Control Architecture:
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#0f172a', border: '1px solid #334155' }}>
        <Box component="pre" sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.9rem' }}>
{`User Interface (Web Browser)
        ↓
WebSocket Connection
        ↓
Server (Command Processing)
        ↓
Serial Communication
        ↓
Arduino Microcontroller
        ↓
Sensors & Actuators`}
        </Box>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Benefits of IoT in Robotics Education:
      </Typography>
      
      <Box component="ul" sx={{ mb: 3, pl: 3 }}>
        <li>Global accessibility to hardware resources</li>
        <li>Real-time data collection and analysis</li>
        <li>Cost-effective scaling of laboratory equipment</li>
        <li>Enhanced collaboration between remote teams</li>
        <li>24/7 availability for experimentation</li>
      </Box>
      
      <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
        Our remote lab demonstrates the practical application of IoT principles, 
        preparing students for the connected world of tomorrow's robotics industry.
      </Typography>
    </BlogPage>
  );
};

export default IoTRemoteControl;
