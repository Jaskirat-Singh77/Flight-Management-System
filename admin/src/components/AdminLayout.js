import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FlightIcon from '@mui/icons-material/Flight';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const drawerWidth = 240;

function AdminLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Manage Flights', icon: <FlightIcon />, path: '/flights' },
    { text: 'View Bookings', icon: <BookmarksIcon />, path: '/bookings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Airline Admin Portal
          </Typography>
          <Button color="inherit" onClick={auth.logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Side Drawer (Navigation) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Spacer to push content below app bar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}
      >
        <Toolbar /> {/* Spacer */}
        <Outlet /> {/* This is where the nested routes will render */}
      </Box>
    </Box>
  );
}

export default AdminLayout;