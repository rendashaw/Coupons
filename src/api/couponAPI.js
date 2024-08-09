import axios from 'axios';

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InQtcm9lbmRhc2hhdyIsInN1YiI6InQtcm9lbmRhc2hhdyIsImp0aSI6Ijk3MWVjMzNlIiwicm9sZSI6IkNhdGFsb2cuUmVhZFdyaXRlIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MiIsIm5iZiI6MTcyMTA3ODYxOSwiZXhwIjoxNzI5MDI3NDE5LCJpYXQiOjE3MjEwNzg2MjAsImlzcyI6ImRvdG5ldC11c2VyLWp3dHMifQ.TuY3334ZU4LUXgwxXW12BTBCrJZ9OH_zRcX5EvK4oP0';

axios.defaults.baseURL = 'https://localhost:8082/'; 

export const generateCoupons = async (couponData) => {
  try {
    const response = await axios.post('/api/coupons/generate', couponData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating coupons:', error);
    throw error;
  }
};

export const getCouponDetails = async (sourceId, couponCode) => {
  try {
    const response = await axios.get(`/api/coupons/${couponCode}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        sourceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting coupon details:', error);
    throw error;
  }
};

export const getBatchDetails = async (sourceId, batchCode) => {
  try {
    const response = await axios.get(`/api/coupons/batch/${batchCode}/${sourceId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting batch details:', error);
    throw error;
  }
};

export const listCoupons = async (sourceId, batchCode) => {
  try {
    const response = await axios.get(`/api/coupons/list/${batchCode}/${sourceId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data.couponCodes; 
  } catch (error) {
    console.error('Error listing coupons:', error);
    throw error;
  }
};

export const listBatches = async (sourceId) => {
  try {
    const response = await axios.get(`/api/coupons/listBatches/${sourceId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data.couponBatches; 
  } catch (error) {
    console.error('Error listing batches:', error);
    throw error;
  }
};

export const revokeCoupons = async (sourceId, couponCodes) => {
  try {
    console.log('Revoking coupons with data:', { sourceId, couponCodes });
    const response = await axios.post(`/api/coupons/revokeCoupon/${couponCodes[0]}/${sourceId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error revoking coupons:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const revokeBatches = async (sourceId, batchCodes) => {
  try {
    console.log('Revoking batches with data:', { sourceId, batchCodes });
    const response = await axios.post(`/api/coupons/revoke/${batchCodes[0]}/${sourceId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error revoking batches:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateBatchDetails = async (updateData) => {
  try {
    const response = await axios.post(`/api/coupons/updateBatch`, updateData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating batch details:', error);
    throw error;
  }
};

export const redeemCoupon = async (couponCode, sourceId) => {
  try {
    const response = await axios.post(`/api/coupons/redeem/${couponCode}/${sourceId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error redeeming coupon:', error.response ? error.response.data : error.message);
    throw error;
  }
};

