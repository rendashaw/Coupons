import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Card, CardContent, CardHeader, Slide, MenuItem } from '@mui/material';
import { easing } from '@mui/material/styles';
import { updateBatchDetails, getBatchDetails } from '../api/couponAPI'; 
import '../css/UpdatePage.css';

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

const UpdatePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [rightTabIndex, setRightTabIndex] = useState(0); 
  const [responseMessage, setResponseMessage] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemId, setItemId] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [updatedBatch, setUpdatedBatch] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [shake, setShake] = useState(false);
  const errorMessageRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setShowCard(false);
    setResponseMessage('');
  };

  const handleRightTabChange = (event, newValue) => {
    setRightTabIndex(newValue);
  };

  const scrollToError = () => {
    if (errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      scrollToError();
    }
  }, [showSuccessMessage]);

  const handleUpdateBatchDetails = async () => {
    if (!sourceId || !batchCode || !startDate || !itemId) {
      setResponseMessage('Source ID, Batch Code, Start Date, and Redeem Item are required.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000); 
      return;
    }

    try {
      const requestData = { sourceId, batchCode, startDate, expirationDate, itemId: itemGuids[itemId] };
      const response = await updateBatchDetails(requestData);
      const details = await getBatchDetails(sourceId, batchCode); 

      setUpdatedBatch(details);
      setShowCard(true);
      setResponseMessage('Batch details updated successfully.');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000); 
      console.log('Update response:', response);
    } catch (error) {
      console.error('Failed to update batch details:', error);
      setResponseMessage(determineErrorMessage(error));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000); 
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const determineErrorMessage = (error) => {
    if (error && error.response && error.response.data && error.response.data.detail) {
      const detail = error.response.data.detail.toLowerCase();
      if (detail.includes('batch is revoked')) {
        return 'Batch is revoked.';
      }
      if (detail.includes('source id')) {
        return 'Invalid Source ID';
      }
      return error.response.data.detail;
    }
    if (!sourceId) {
      return 'Invalid Source ID';
    } else if (!batchCode) {
      return 'Invalid Batch Code';
    }
    return 'Invalid Input';
  };

  const handleClear = () => {
    setResponseMessage('');
    setShowCard(false);
    setSourceId('');
    setBatchCode('');
    setStartDate('');
    setExpirationDate('');
    setItemId('');
  };

  const handleExport = () => {
    if (updatedBatch) {
      const dataStr = JSON.stringify(updatedBatch, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'batch-details.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getRedeemItemIcon = (itemId) => {
    const itemName = guidToItem[itemId];
    return itemName ? <img src={itemImages[itemName]} alt={itemName} className="redeem-icon" /> : itemId;
  };

  return (
    <Box className="update-page">
      <Box className={`update-form-container ${shake ? 'shake' : ''}`}>
        <Typography variant="h5" className="update-title">
          Update
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} className="update-tabs">
          <Tab label="Update Batch Details" />
        </Tabs>
        <Box className="update-form-section">
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
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Expiration Date"
            type="date"
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <TextField
            label="Redeem Item"
            select
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 200, 
                  },
                },
              },
            }}
          >
            <MenuItem value="gold">
              <img src="/images/gold-coin-icon-png.webp" alt="Gold" className="menu-item-logo" />
              Gold
            </MenuItem>
            <MenuItem value="silver">
              <img src="/images/silver.png" alt="Silver" className="menu-item-logo" />
              Silver
            </MenuItem>
            <MenuItem value="bronze">
              <img src="/images/bronze-coin-icon.png" alt="Bronze" className="menu-item-logo" />
              Bronze
            </MenuItem>
            <MenuItem value="platinum">
              <img src="/images/platinum-coin-icon.png" alt="Platinum" className="menu-item-logo" />
              Platinum
            </MenuItem>
            <MenuItem value="diamond">
              <img src="/images/diamond-icon.png" alt="Diamond" className="menu-item-logo" />
              Diamond
            </MenuItem>
          </TextField>
          <Box className="update-form-actions">
            <Button variant="outlined" className="update-custom-button" onClick={handleUpdateBatchDetails}>
              Update
            </Button>
            <Button variant="outlined" className="update-custom-clear-button" onClick={handleClear}>
              Clear
            </Button>
          </Box>
          {responseMessage && (
            <Box 
              ref={errorMessageRef}
              className={`${
                responseMessage === 'Batch details updated successfully.'
                  ? 'update-success-message'
                  : 'update-error-message'
              } fade-out ${showSuccessMessage ? 'show' : ''}`}
            >
              <Typography variant="body1">{responseMessage}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <div className="update-separator"></div>
      <Box className="update-card-container">
        <Typography variant="h5" className="summary-text">
          Summary
        </Typography>
        <Tabs value={rightTabIndex} onChange={handleRightTabChange} className="update-tabs">
          <Tab label="Table" />
        </Tabs>
        <Slide
          direction="left"
          in={showCard}
          mountOnEnter
          unmountOnExit
          timeout={1500}
          easing={{
            enter: easing.easeOut,
            exit: easing.sharp,
          }}
        >
          <Box>
            {updatedBatch && (
              <Box className="card-and-button-container">
                <Card className="details-card">
                  <CardHeader title="Batch Details" className="batch-details-header" />
                  <CardContent>
                    <Typography variant="body2">
                      <strong>Count:</strong> {updatedBatch.count || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Redeem Item:</strong> {getRedeemItemIcon(updatedBatch.itemId) || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Start Date:</strong> {updatedBatch.startDate ? new Date(updatedBatch.startDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Expiration Date:</strong> {updatedBatch.expirationDate ? new Date(updatedBatch.expirationDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Batch Code:</strong> {updatedBatch.batchCode || 'N/A'}
                    </Typography>
                    <Typography variant="body2" className={`status-${updatedBatch.status.toLowerCase()}`}>
                      <strong>Status:</strong> <span className="status-text">{updatedBatch.status}</span>
                    </Typography>
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

export default UpdatePage;