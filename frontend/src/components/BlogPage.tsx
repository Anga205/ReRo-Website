import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from '../components/Navbar';

interface BlogPageProps {
  title: string;
  children: React.ReactNode;
}

const BlogPage: React.FC<BlogPageProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            bgcolor: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #334155'
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 4, 
              color: 'primary.main',
              fontWeight: 700 
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ color: 'text.primary' }}>
            {children}
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default BlogPage;
