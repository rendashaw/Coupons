import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Card, CardContent, CardHeader, Slide } from '@mui/material';
import { easing } from '@mui/material/styles';
import { revokeCoupons, revokeBatches, getCouponDetails, getBatchDetails } from '../api/couponAPI';
import '../css/RevokePage.css';

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

const RevokePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [code, setCode] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [revokedItem, setRevokedItem] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shake, setShake] = useState(false);

  const handleTabChange = (event, newValue) => {
    if (showCard) {
      setTransitioning(true);
      setTimeout(() => {
        setTransitioning(false);
        setTabIndex(newValue);
        setShowCard(false);
        setResponseMessage('');
        setRevokedItem(null);
      }, 1000);
    } else {
      setTabIndex(newValue);
      setShowCard(false);
      setResponseMessage('');
      setRevokedItem(null);
    }
  };

  const handleRevoke = async () => {
    if (!sourceId || !code) {
      setResponseMessage(determineErrorMessage());
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      let details = null;
      if (tabIndex === 0) {
        await revokeCoupons(sourceId, [code]);
        details = await getCouponDetails(sourceId, code);
      } else {
        await revokeBatches(sourceId, [code]);
        details = await getBatchDetails(sourceId, code);
      }
      setRevokedItem({ type: tabIndex === 0 ? 'Coupon' : 'Batch', code, details });
      setShowCard(true);
      setShake(false);
      setResponseMessage('');
    } catch (error) {
      console.error('Failed to revoke:', error);
      setResponseMessage(determineErrorMessage(error));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowCard(false);
    }
  };

  const determineErrorMessage = (error) => {
    if (error && error.response && error.response.data && error.response.data.detail) {
      const detail = error.response.data.detail.toLowerCase();
      if (detail.includes('source id')) {
        return 'Invalid Source ID';
      }
      if (detail.includes('coupon has either been revoked or redeemed')) {
        return 'Coupon not active';
      }
      if (detail.includes('batch has either been revoked or redeemed')) {
        return 'Batch not active';
      }
      if (detail.includes('coupon')) {
        return 'Invalid Coupon Code';
      }
      if (detail.includes('batch')) {
        return 'Invalid Batch Code';
      }
      return error.response.data.detail;
    }
    if (!sourceId) {
      return 'Invalid Source ID';
    } else if (tabIndex === 0 && !code) {
      return 'Invalid Coupon Code';
    } else if (tabIndex === 1 && !code) {
      return 'Invalid Batch Code';
    }
    return 'Invalid Input';
  };

  const handleClear = () => {
    setTransitioning(true);
    setTimeout(() => {
      setSourceId('');
      setCode('');
      setShowCard(false);
      setResponseMessage('');
      setRevokedItem(null);
      setTransitioning(false);
    }, 1000);
  };

  const handleExport = () => {
    if (revokedItem) {
      const dataStr = JSON.stringify(revokedItem.details, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${revokedItem.type.toLowerCase()}-details.json`;
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
    switch (status?.toLowerCase()) {
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
    <Box className="revoke-page">
      <Box className={`revoke-form-container ${shake ? 'shake' : ''}`}>
        <Typography variant="h5" className="revoke-title">
          Revoke
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} className="revoke-tabs">
          <Tab label="Revoke Coupons" />
          <Tab label="Revoke Batches" />
        </Tabs>
        <Box className="revoke-form-section">
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
            label={tabIndex === 0 ? 'Coupon Code' : 'Batch Code'}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Box className="revoke-form-actions">
            <Button variant="outlined" className="revoke-custom-button" onClick={handleRevoke}>
              Revoke
            </Button>
            <Button variant="outlined" className="revoke-custom-clear-button" onClick={handleClear}>
              Clear
            </Button>
          </Box>
          {responseMessage && (
            <Box className="response-message error-message fade-out">
              <Typography variant="body1">{responseMessage}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <div className="revoke-separator"></div>
      <Box className="revoke-summary-container">
        <Typography variant="h5" className="revoke-summary-text">
          Summary
        </Typography>
        <Tabs value={0} className="revoke-tabs">
          <Tab label="Table" />
        </Tabs>
        <Slide
          direction="left"
          in={showCard && !transitioning}
          mountOnEnter
          unmountOnExit
          timeout={1500}
          easing={{
            enter: easing.easeOut,
            exit: easing.sharp,
          }}
        >
          <Box>
            {revokedItem && (
              <Box className="card-and-button-container">
                <Card className="details-card">
                  <CardHeader title={`${revokedItem.type} Details`} className={`revoke-details-header ${revokedItem.type === 'Batch' ? 'batch-header' : 'coupon-header'}`} />
                  <CardContent>
                    {revokedItem.details && (
                      <>
                        {revokedItem.type === 'Coupon' ? (
                          <>
                            <Typography variant="body2">
                              <strong>Redeem Item:</strong> {getRedeemItemIcon(revokedItem.details.itemId) || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Start Date:</strong> {revokedItem.details.startDate ? new Date(revokedItem.details.startDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Expiration Date:</strong> {revokedItem.details.expirationDate ? new Date(revokedItem.details.expirationDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Coupon Code:</strong> {revokedItem.code}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Batch Code:</strong> {revokedItem.details.batchCode || 'N/A'}
                            </Typography>
                            <Typography variant="body2" className={getStatusClass(revokedItem.details.status)}>
                              <strong>Status:</strong> <span className="status-text">{revokedItem.details.status}</span>
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2">
                              <strong>Count:</strong> {revokedItem.details.count || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Redeem Item:</strong> {getRedeemItemIcon(revokedItem.details.itemId) || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Start Date:</strong> {revokedItem.details.startDate ? new Date(revokedItem.details.startDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Expiration Date:</strong> {revokedItem.details.expirationDate ? new Date(revokedItem.details.expirationDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Batch Code:</strong> {revokedItem.details.batchCode || 'N/A'}
                            </Typography>
                            <Typography variant="body2" className={getStatusClass(revokedItem.details.status)}>
                              <strong>Status:</strong> <span className="status-text">{revokedItem.details.status}</span>
                            </Typography>
                          </>
                        )}
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

export default RevokePage;
