import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import '../css/RedeemPage.css';
import { getCouponDetails, redeemCoupon } from '../api/couponAPI';

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

const RedeemPage = () => {
  const [couponCode, setCouponCode] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [inventory, setInventory] = useState([]);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [previousSourceId, setPreviousSourceId] = useState('');

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleRedeemCoupon = async () => {
    try {
      if (sourceId !== previousSourceId) {
        setInventory([]);
        setRedeemedCoupons([]);
        setPreviousSourceId(sourceId);
      }
      await redeemCoupon(couponCode, sourceId);
      const details = await getCouponDetails(sourceId, couponCode);
      if (details) {
        setInventory(prevInventory => [
          ...prevInventory,
          {
            coupon: couponCode,
            redeemItem: details.itemId,
            itemId: itemGuids[guidToItem[details.itemId]] || 'Unknown',
          },
        ]);
        setErrorMessage('');
        setCouponCode('');
      } else {
        setErrorMessage('Coupon not found or already redeemed.');
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      setErrorMessage(determineErrorMessage(error));
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setCouponCode('');
    }
  };

  const determineErrorMessage = (error) => {
    if (error && error.response && error.response.data && error.response.data.detail) {
      const detail = error.response.data.detail.toLowerCase();
      if (detail.includes('source id')) {
        return 'Invalid Source ID';
      }
      if (detail.includes('coupon has either been revoked or redeemed')) {
        return 'Coupon not active.';
      }
      if (detail.includes('coupon')) {
        return 'Invalid Coupon Code';
      }
      return error.response.data.detail;
    }
    if (!sourceId) {
      return 'Invalid Source ID';
    } else if (!couponCode) {
      return 'Invalid Coupon Code';
    }
    return 'Invalid Input';
  };

  const handleClear = () => {
    setCouponCode('');
    setSourceId('');
    setInventory([]);
    setErrorMessage('');
    setPreviousSourceId('');
  };

  const handleSourceIdChange = (e) => {
    setSourceId(e.target.value);
  };

  const getRedeemItemIcon = (itemId) => {
    const itemName = guidToItem[itemId];
    return itemName ? <img src={itemImages[itemName]} alt={itemName} className="redeem-icon" /> : itemId;
  };

  return (
    <Box className="redeem-page">
      <Box className={`form-container ${shake ? 'shake' : ''}`}>
        <Typography variant="h5" gutterBottom>
          Redeem Coupon
        </Typography>
        <TextField
          label="Source ID"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={sourceId}
          onChange={handleSourceIdChange}
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
          <Button variant="outlined" className="custom-button" onClick={handleRedeemCoupon}>
            Redeem Coupon
          </Button>
          <Button variant="outlined" className="custom-clear-button" onClick={handleClear}>
            Clear
          </Button>
        </Box>
        {errorMessage && (
          <Box className="error-message fade-out">
            <Typography variant="body1">{errorMessage}</Typography>
          </Box>
        )}
      </Box>
      <div className="separator"></div>
      <Box className="card-container">
        <Typography variant="h5" className="details-text">
          Details
        </Typography>
        <TableContainer component={Paper} className="inventory-table-container">
          <Table className="inventory-table">
            <TableHead>
              <TableRow>
                <TableCell>Coupon</TableCell>
                <TableCell>Redeem Item</TableCell>
                <TableCell>Item ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((row, index) => (
                <TableRow key={row.coupon} className={`scrollable-row fade-in-row row-${index % 2}`}>
                  <TableCell>{row.coupon}</TableCell>
                  <TableCell>{getRedeemItemIcon(row.redeemItem)}</TableCell>
                  <TableCell>{row.itemId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default RedeemPage;
