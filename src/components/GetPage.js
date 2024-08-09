import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader, Tabs, Tab, Slide } from '@mui/material';
import { easing } from '@mui/material/styles';
import { getCouponDetails, getBatchDetails } from '../api/couponAPI';
import '../css/GetPage.css';

const itemImages = {
  gold: '/images/gold-coin-icon-png.webp',
  silver: '/images/silver.png',
  bronze: '/images/bronze-coin-icon.png',
  platinum: '/images/platinum-coin-icon.png',
  diamond: '/images/diamond-icon.png',
};

const itemGuids = {
  gold: 'b123f3c1-6c0b-42a9-91e4-7d939dc6a1a7',
  silver: 'e456c9f4-3d0e-4b9b-8d7b-4f1e0b9e2c9e',
  bronze: 'f789d6a5-5f0a-4c3d-8e3b-6b1e0a8e3f6d',
  platinum: 'a321e7b2-1b2d-4e8c-9f4b-8d7e0c9f4b1e',
  diamond: 'd654a2f3-7e2d-4f3b-9d6e-4c1b9e2d5c8f',
};

const guidToItem = Object.fromEntries(Object.entries(itemGuids).map(([key, value]) => [value, key]));

const GetPage = () => {
  const [leftTabIndex, setLeftTabIndex] = useState(0);
  const [rightTabIndex, setRightTabIndex] = useState(0);
  const [sourceId, setSourceId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [details, setDetails] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [shake, setShake] = useState(false);

  const handleLeftTabChange = (event, newValue) => {
    if (showCard) {
      setTransitioning(true);
      setTimeout(() => {
        setTransitioning(false);
        setLeftTabIndex(newValue);
        setShowCard(false);
        setDetails(null);
        setResponseMessage('');
      }, 1000); 
    } else {
      setLeftTabIndex(newValue);
      setShowCard(false);
      setDetails(null);
      setResponseMessage('');
    }
  };

  const handleRightTabChange = (event, newValue) => {
    setRightTabIndex(newValue);
  };

  const handleGetDetails = async () => {
    try {
      let response;
      if (leftTabIndex === 0) {
        response = await getCouponDetails(sourceId, couponCode);
      } else {
        response = await getBatchDetails(sourceId, batchCode);
      }
      setDetails(response);
      setShowCard(true);
      setShake(false);
      clearInputs();
    } catch (error) {
      console.error('Failed to get details:', error);
      setResponseMessage(determineErrorMessage(error));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowCard(false);
      clearInputs();
    }
  };

  const determineErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.detail) {
      return error.response.data.detail;
    }
    if (!sourceId) {
      return 'Invalid Source ID';
    } else if (leftTabIndex === 0 && !couponCode) {
      return 'Invalid Coupon Code';
    } else if (leftTabIndex === 1 && !batchCode) {
      return 'Invalid Batch Code';
    }
    return 'Invalid Input';
  };

  const clearInputs = () => {
    setSourceId('');
    setCouponCode('');
    setBatchCode('');
  };

  const handleClear = () => {
    setTransitioning(true);
    setTimeout(() => {
      setResponseMessage('');
      setShowCard(false);
      setDetails(null);
      clearInputs();
      setTransitioning(false);
    }, 1000); 
  };

  const handleExport = () => {
    if (details) {
      const dataStr = JSON.stringify(details, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `details.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getRedeemItemIcon = (itemId) => {
    const itemName = guidToItem[itemId];
    return itemName ? <img src={itemImages[itemName]} alt={itemName} className="redeem-icon" /> : itemId;
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'revoked':
        return 'status-revoked';
      case 'redeemed':
        return 'status-redeemed';
      default:
        return '';
    }
  };

  return (
    <Box className="get-page">
      <Box className={`form-container ${shake ? 'shake' : ''}`}>
        <Typography variant="h5" gutterBottom>
          Get Details
        </Typography>
        <Tabs value={leftTabIndex} onChange={handleLeftTabChange} className="tabs">
          <Tab label="Get Coupon Details" />
          <Tab label="Get Batch Details" />
        </Tabs>
        {leftTabIndex === 0 && (
          <Box className="form-section">
            <TextField
              label="Source ID"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
            />
            <TextField
              label="Coupon Code"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Box className="form-actions">
              <Button variant="outlined" className="custom-button" onClick={handleGetDetails}>
                Get Details
              </Button>
              <Button variant="outlined" className="custom-clear-button" onClick={handleClear}>
                Clear
              </Button>
            </Box>
          </Box>
        )}
        {leftTabIndex === 1 && (
          <Box className="form-section">
            <TextField
              label="Source ID"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
            />
            <TextField
              label="Batch Code"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
            />
            <Box className="form-actions">
              <Button variant="outlined" className="custom-button" onClick={handleGetDetails}>
                Get Batch Details
              </Button>
              <Button variant="outlined" className="custom-clear-button" onClick={handleClear}>
                Clear
              </Button>
            </Box>
          </Box>
        )}
        {responseMessage && (
          <Box className={`response-message error-message fade-out`}>
            <Typography variant="body1">{responseMessage}</Typography>
          </Box>
        )}
      </Box>
      <div className="separator"></div>
      <Box className="card-container">
        <Typography variant="h5" className="details-text">
          Summary
        </Typography>
        <Tabs value={rightTabIndex} onChange={handleRightTabChange} className="tabs">
          <Tab label="Table" />
        </Tabs>
        <Slide
          direction="left"
          in={showCard && !transitioning}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 1500, exit: 1000 }}
          easing={{
            enter: easing.easeOut,
            exit: easing.easeIn,
          }}
        >
          <Box>
            {details && (
              <Box className="card-and-button-container">
                <Card className={`details-card ${leftTabIndex === 0 ? 'coupon-details' : 'batch-details'}`}>
                  <CardHeader title={leftTabIndex === 0 ? 'Coupon Details' : 'Batch Details'} />
                  <CardContent>
                    {leftTabIndex === 0 ? (
                      <>
                        <Typography variant="body2">
                          <strong>Redeem Item:</strong> {getRedeemItemIcon(details.itemId) || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Start Date:</strong> {details.startDate ? new Date(details.startDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Expiration Date:</strong> {details.expirationDate ? new Date(details.expirationDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Coupon Code:</strong> {details.couponCode || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Batch Code:</strong> {details.batchCode || 'N/A'}
                        </Typography>
                        <Typography variant="body2" className={getStatusClass(details.status)}>
                          <strong>Status:</strong> <span className="status-text">{details.status || 'N/A'}</span>
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">
                          <strong>Count:</strong> {details.count || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Redeem Item:</strong> {getRedeemItemIcon(details.itemId) || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Start Date:</strong> {details.startDate ? new Date(details.startDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Expiration Date:</strong> {details.expirationDate ? new Date(details.expirationDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Batch Code:</strong> {details.batchCode || 'N/A'}
                        </Typography>
                        <Typography variant="body2" className={getStatusClass(details.status)}>
                          <strong>Status:</strong> <span className="status-text">{details.status || 'N/A'}</span>
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Box className="export-button-container">
                  <Button variant="outlined" className="export-button" onClick={handleExport}>
                    Export JSON
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default GetPage;
