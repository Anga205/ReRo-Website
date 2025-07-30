import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import BlogPage from '../../components/BlogPage';

const ArduinoBasics: React.FC = () => {
  return (
    <BlogPage title="Arduino Programming Basics">
      <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
        Master the Fundamentals of Arduino Programming
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        Arduino is the heart of our remote robotics lab. Understanding Arduino programming 
        is essential for creating effective robotic systems. This guide covers the basics 
        you need to know to get started with our remote lab.
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Basic Arduino Structure:
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#030712', border: '1px solid #374151' }}>
        <Box component="pre" sx={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.9rem' }}>
{`void setup() {
  // This function runs once when the Arduino starts
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  // This function runs repeatedly
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`}
        </Box>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Key Concepts:
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
        <strong>Digital Pins:</strong> Used for digital input/output (HIGH or LOW)
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
        <strong>Analog Pins:</strong> Used for reading analog values (0-1023)
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
        <strong>Serial Communication:</strong> Send data back to the computer for monitoring
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        Common Functions:
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399', mb: 1 }}>
          pinMode(pin, mode) - Configure pin as INPUT or OUTPUT
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399', mb: 1 }}>
          digitalWrite(pin, value) - Write HIGH or LOW to digital pin
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399', mb: 1 }}>
          digitalRead(pin) - Read digital value from pin
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399', mb: 1 }}>
          analogRead(pin) - Read analog value (0-1023)
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#34d399' }}>
          delay(ms) - Pause execution for specified milliseconds
        </Typography>
      </Box>
    </BlogPage>
  );
};

export default ArduinoBasics;
