import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import BlogPage from '../../components/BlogPage';

const ProjectGallery: React.FC = () => {
  const projects = [
    {
      title: "LED Blink Controller",
      description: "Basic Arduino project controlling multiple LEDs in different patterns",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Sensor Data Logger",
      description: "Reading and logging environmental sensor data remotely",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Servo Motor Control",
      description: "Precise control of servo motors for robotic arm movements",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <BlogPage title="Project Gallery">
      <Typography variant="h5" sx={{ mb: 3, color: 'secondary.main' }}>
        Explore Amazing Projects Created in Our Remote Lab
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
        See what fellow students and researchers have built using our remote robotics platform. 
        Get inspired and learn from real-world applications.
      </Typography>
      
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
            <Card sx={{ height: '100%', bgcolor: '#030712', border: '1px solid #374151' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  bgcolor: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Project Image
                </Typography>
              </CardMedia>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  {project.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {project.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, p: 3, bgcolor: '#111827', borderRadius: 2, border: '1px solid #374151' }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
          Submit Your Project
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Have you created something amazing in our lab? We'd love to feature your project! 
          Contact us with your project details, code, and results to be included in our gallery.
        </Typography>
      </Box>
    </BlogPage>
  );
};

export default ProjectGallery;
