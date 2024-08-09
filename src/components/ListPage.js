import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CardHeader, Tabs, Tab, Slide } from '@mui/material';
import { easing } from '@mui/material/styles';
import { listCoupons, listBatches, getBatchDetails } from '../api/couponAPI';
import '../css/ListPage.css';

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

const ListPage = () => {
  const [leftTabIndex, setLeftTabIndex] = useState(0);
  const [rightTabIndex, setRightTabIndex] = useState(0);
  const [couponList, setCouponList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [redeemItem, setRedeemItem] = useState(null);
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
        setCouponList([]);
        setBatchList([]);
        setResponseMessage('');
      }, 1000); 
    } else {
      setLeftTabIndex(newValue);
      setShowCard(false);
      setCouponList([]);
      setBatchList([]);
      setResponseMessage('');
    }
  };

  const handleRightTabChange = (event, newValue) => {
    setRightTabIndex(newValue);
  };

  const handleListCoupons = async () => {
    try {
      const response = await listCoupons(sourceId, batchCode);
      const batchDetails = await getBatchDetails(sourceId, batchCode);
      setCouponList(response);
      setRedeemItem(batchDetails.itemId);
      setShowCard(true);
      setShake(false);
      setResponseMessage('');
    } catch (error) {
      console.error('Failed to list coupons:', error);
      setResponseMessage(determineErrorMessage(error));
      setCouponList([]);
      setShowCard(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleListBatches = async () => {
    try {
      const response = await listBatches(sourceId);
      setBatchList(response);
      setShowCard(true);
      setShake(false);
      setResponseMessage('');
    } catch (error) {
      console.error('Failed to list batches:', error);
      setResponseMessage(determineErrorMessage(error));
      setBatchList([]);
      setShowCard(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const determineErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.detail) {
      return error.response.data.detail;
    }
    if (!sourceId) {
      return 'Invalid Source ID';
    } else if (leftTabIndex === 0 && !batchCode) {
      return 'Invalid Batch Code';
    }
    return 'Invalid Input';
  };

  const handleClear = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCouponList([]);
      setBatchList([]);
      setShowCard(false);
      setSourceId('');
      setBatchCode('');
      setRedeemItem(null);
      setResponseMessage('');
      setTransitioning(false);
    }, 1000); 
  };

  const handleExport = () => {
    const dataToExport = leftTabIndex === 0 ? couponList : batchList;
    if (!dataToExport || dataToExport.length === 0) return;

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'details.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getIconForRedeemItem = (itemId) => {
    const itemName = guidToItem[itemId];
    return itemName ? <img src={itemImages[itemName]} alt={itemName} className="list-redeem-icon" /> : itemId;
  };

  const getBatchLabel = (index) => {
    const labels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    return labels[index] || (index + 1).toString();
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
    <Box className="list-page">
      <Box className={`list-form-container ${shake ? 'shake' : ''}`}>
        <Typography variant="h5" gutterBottom>
          List Details
        </Typography>
        <Tabs value={leftTabIndex} onChange={handleLeftTabChange} className="list-tabs">
          <Tab label="List Coupons" />
          <Tab label="List Batches" />
        </Tabs>
        <Box className="list-form-section">
          <TextField
            label="Source ID"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
          />
          {leftTabIndex === 0 && (
            <TextField
              label="Batch Code"
              fullWidth
              variant="outlined"
              margin="normal"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
            />
          )}
          <Box className="list-form-actions">
            <Button 
              variant="outlined" 
              className="list-custom-button" 
              onClick={leftTabIndex === 0 ? handleListCoupons : handleListBatches}
            >
              List {leftTabIndex === 0 ? 'Coupons' : 'Batches'}
            </Button>
            <Button variant="outlined" className="list-custom-clear-button" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Box>
        {responseMessage && (
          <Box className="response-message error-message fade-out">
            <Typography variant="body1">{responseMessage}</Typography>
          </Box>
        )}
      </Box>
      <div className="list-separator"></div>
      <Box className="list-card-container">
        <Typography variant="h5" className="list-details-text">
          Summary
        </Typography>
        <Tabs value={rightTabIndex} onChange={handleRightTabChange} className="list-tabs">
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
            {leftTabIndex === 0 && couponList.length > 0 && (
              <Card className="list-details-card">
                <CardHeader title="Coupon List" className="coupon-list-title" />
                <CardContent>
                  {couponList.map((coupon, index) => (
                    <Typography key={index} variant="body1">
                      {index + 1}: {coupon}
                      {redeemItem && getIconForRedeemItem(redeemItem)}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            )}
            {leftTabIndex === 1 && batchList.length > 0 && (
              batchList.map((batch, index) => (
                <Card key={index} className="list-details-card">
                  <CardHeader title={`Batch ${getBatchLabel(index)}`} className="batch-details-header" />
                  <CardContent>
                    <Typography variant="body2">
                      Batch Code: {batch.batchCode}
                    </Typography>
                    <Typography variant="body2">
                      Redeem Item: 
                      {getIconForRedeemItem(batch.itemId)}
                    </Typography>
                    <Typography variant="body2">
                      Start Date: {new Date(batch.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Expiration Date: {new Date(batch.expirationDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" className={getStatusClass(batch.status)}>
                      Status: <span className="status-text">{batch.status}</span>
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
            {showCard && !transitioning && (
              <Box className="export-button-container">
                <Button variant="outlined" className="export-button" onClick={handleExport}>
                  Export JSON
                </Button>
              </Box>
            )}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default ListPage;
