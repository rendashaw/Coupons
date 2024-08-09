import React, { useContext, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { generateCoupons } from '../api/couponAPI'; 
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { CouponContext } from './CouponContext'; 
import '../css/GeneratePage.css'; 

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

const GeneratePage = () => {
  const { generatePageState, setGeneratePageState, coupons, setCoupons } = useContext(CouponContext);


  useEffect(() => {
    setGeneratePageState(prevState => ({ ...prevState, leftTabIndex: 0 }));
  }, [setGeneratePageState]);

  const handleLeftTabChange = (event, newValue) => {
    setGeneratePageState({ ...generatePageState, leftTabIndex: newValue });
  };

  const handleRightTabChange = (event, newValue) => {
    setGeneratePageState({ ...generatePageState, rightTabIndex: newValue });
  };

  const handleGenerate = async () => {
   
    if (!generatePageState.startDate || isNaN(new Date(generatePageState.startDate).getTime())) {
      console.error('Invalid start date');
      return;
    }

 
    if (generatePageState.expirationDate && isNaN(new Date(generatePageState.expirationDate).getTime())) {
      console.error('Invalid expiration date');
      return;
    }

    const couponData = {
      count: parseInt(generatePageState.count, 10),
      itemId: itemGuids[generatePageState.itemId],
      startDate: new Date(generatePageState.startDate).toISOString(),
      expirationDate: generatePageState.expirationDate ? new Date(generatePageState.expirationDate).toISOString() : null,
      sourceId: generatePageState.sourceId,
      batchCode: generatePageState.batchCode || null
    };

    console.log('Sending request:', couponData);
    
    try {
      const response = await generateCoupons(couponData);
      console.log('Coupons generated successfully:', response);

      const newCoupons = response.couponCodes.map(code => ({
        batchCode: response.batchCode,
        couponCode: code,
        startDate: response.startDate,
        expirationDate: response.expirationDate,
        type: response.Type,
        itemId: response.itemId
      }));

      setCoupons(prevCoupons => {
     
        const existingBatchIndex = prevCoupons.findIndex(coupon => coupon.batchCode === response.batchCode);
        if (existingBatchIndex >= 0) {
          
          const updatedCoupons = [...prevCoupons];
          const existingCoupons = updatedCoupons.filter(coupon => coupon.batchCode !== response.batchCode);
          return [...existingCoupons, ...newCoupons];
        } else {
        
          return [...prevCoupons, ...newCoupons];
        }
      });
    } catch (error) {
      console.error('Failed to generate coupons:', error);
    }
  };

  const handleClear = () => {
    setCoupons([]);
    setGeneratePageState({
      leftTabIndex: 0,
      rightTabIndex: 0,
      sourceId: '',
      batchCode: '',
      itemId: '',
      startDate: '',
      expirationDate: '',
      count: '',
    });
  };

  const handleExport = () => {
    const batchCodes = [...new Set(coupons.map(coupon => coupon.batchCode))];
    batchCodes.forEach(batchCode => {
      const batchCoupons = coupons.filter(coupon => coupon.batchCode === batchCode);
      const exportData = {
        count: batchCoupons.length,
        startDate: batchCoupons[0].startDate,
        expirationDate: batchCoupons[0].expirationDate,
        itemId: batchCoupons[0].itemId,
        batchCode: batchCode,
        Type: batchCoupons[0].type,
        couponCodes: batchCoupons.map(c => c.couponCode)
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coupons_${batchCode}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Box className="generate-page">
      <Box className="form-container">
        <Typography variant="h5" gutterBottom>
          Create New Coupons
        </Typography>
        <Tabs value={generatePageState.leftTabIndex} onChange={handleLeftTabChange} className="tabs">
          <Tab label="Details" />
        </Tabs>
        {generatePageState.leftTabIndex === 0 && (
          <Box className="form-section">
            <TextField
              label="Source ID"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={generatePageState.sourceId}
              onChange={(e) => setGeneratePageState({ ...generatePageState, sourceId: e.target.value })}
            />
            <TextField
              label="Batch Code"
              fullWidth
              variant="outlined"
              margin="normal"
              value={generatePageState.batchCode}
              onChange={(e) => setGeneratePageState({ ...generatePageState, batchCode: e.target.value })}
            />
            <TextField
              label="Redeem item"
              select
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={generatePageState.itemId}
              onChange={(e) => setGeneratePageState({ ...generatePageState, itemId: e.target.value })}
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
            <TextField
              label="Start date"
              type="date"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={generatePageState.startDate}
              onChange={(e) => setGeneratePageState({ ...generatePageState, startDate: e.target.value })}
            />
            <TextField
              label="End date"
              type="date"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={generatePageState.expirationDate}
              onChange={(e) => setGeneratePageState({ ...generatePageState, expirationDate: e.target.value })}
            />
            <TextField
              label="Count"
              type="number"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={generatePageState.count}
              onChange={(e) => setGeneratePageState({ ...generatePageState, count: e.target.value })}
            />
            <Box className="form-actions">
              <Button variant="outlined" className="custom-button" onClick={handleGenerate}>
                Generate
              </Button>
              <Button variant="outlined" className="custom-clear-button" onClick={handleClear}>
                Clear
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <div className="separator"></div>
      <Box className="table-container">
        <Typography variant="h5" gutterBottom>
          Generated Coupons
        </Typography>
        <Tabs value={generatePageState.rightTabIndex} onChange={handleRightTabChange} className="tabs">
          <Tab label="Table" />
        </Tabs>
        {generatePageState.rightTabIndex === 0 && (
          <Box className="table-section">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Batch Code</TableCell>
                    <TableCell>Coupon Code</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Redeem Item</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TransitionGroup component={null}>
                    {coupons.map((coupon, index) => (
                      <CSSTransition key={index} timeout={500} classNames="fade">
                        <TableRow>
                          <TableCell>{coupon.batchCode}</TableCell>
                          <TableCell>{coupon.couponCode}</TableCell>
                          <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>{coupon.type}</TableCell>
                          <TableCell>
                            <img src={itemImages[guidToItem[coupon.itemId]]} alt={coupon.itemId} className="menu-item-logo" />
                          </TableCell>
                        </TableRow>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </TableBody>
              </Table>
            </TableContainer>
            {coupons.length > 0 && (
              <Box className="export-button-container">
                <Button variant="outlined" className="export-button" onClick={handleExport}>
                  Export JSON
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GeneratePage;
