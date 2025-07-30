import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Typography,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Login as LoginIcon,
  Event as EventIcon,
  Code as CodeIcon,
  Article as ArticleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setSidebarOpen(false);
  };

  const blogPages = [
    { title: 'Getting Started with Remote Robotics', path: '/blog/getting-started' },
    { title: 'Arduino Programming Basics', path: '/blog/arduino-basics' },
    { title: 'IoT and Remote Control', path: '/blog/iot-remote-control' },
    { title: 'Lab Safety Guidelines', path: '/blog/safety-guidelines' },
    { title: 'Project Gallery', path: '/blog/project-gallery' },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: '#111827' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          ReRo Lab
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#374151' }} />
      
      <List>
        <ListItem component="button" onClick={() => handleNavigation('/')} sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <HomeIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ color: 'white' }} />
        </ListItem>
        
        <ListItem component="button" onClick={() => handleNavigation('/booking')} sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <EventIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Book Slots" sx={{ color: 'white' }} />
        </ListItem>
        
        <ListItem component="button" onClick={() => handleNavigation('/arduino')} sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            <CodeIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Arduino/Code" sx={{ color: 'white' }} />
        </ListItem>
      </List>
      
      <Divider sx={{ borderColor: '#374151', my: 1 }} />
      
      <Typography variant="subtitle1" sx={{ px: 2, py: 1, color: '#9ca3af', fontWeight: 600 }}>
        Blog Posts
      </Typography>
      
      <List>
        {blogPages.map((blog, index) => (
          <ListItem key={index} component="button" onClick={() => handleNavigation(blog.path)} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>
              <ArticleIcon sx={{ color: '#60a5fa' }} />
            </ListItemIcon>
            <ListItemText 
              primary={blog.title} 
              sx={{ 
                color: 'white',
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem'
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: '#374151', mb: 2 }} />
        {isAuthenticated ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LoginIcon />}
          >
            Logout
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('/login')}
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'rgba(3, 7, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #374151'
        }}
      >
        <Toolbar>
          {/* Left side: Hamburger + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <img 
              src="/logo.png" 
              alt="ReRo Lab Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
          </Box>

          {/* Center: Empty space for flexibility */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side: Navigation buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/booking')}>
              Slots
            </Button>
            <Button color="inherit" onClick={() => navigate('/arduino')}>
              Arduino/Code
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: '#111827',
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
