import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); 

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <AppBar position="fixed" className="navbar">
        <Toolbar className="toolbar">
          <Box className="navbar-left">
            <img src="/images/second_coupon.png" alt="Background" className="nav-background" />
          </Box>
          <Box className="navbar-middle">
            <Box display="flex" alignItems="center">
              <img src="/images/coupon.png" alt="Coupon" className="nav-logo" />
              <Typography variant="h6" noWrap component="div" className="nav-link">
                Coupons
              </Typography>
            </Box>
          </Box>
          <Box className="navbar-right">
            <img src="/images/second_coupon.png" alt="Background" className="nav-background" />
          </Box>
        </Toolbar>
      </AppBar>
      <div className="secondary-menu">
        <Box className="secondary-menu-content">
          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/generate')}
          >
            Generate
          </Typography>
          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/get')}
          >
            Get
          </Typography>
          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/list')}
          >
            List
          </Typography>

          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/update')}
          >
            Update
          </Typography>
          
          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/revoke')}
          >
            Revoke
          </Typography>
          <Typography
            variant="body1"
            className="menu-item"
            onClick={() => handleNavigation('/redeem')}
          >
            Redeem
          </Typography>
        </Box>
      </div>
    </>
  );
};

export default Navbar;
