import React, { createContext, useState } from 'react';

export const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [getPageState, setGetPageState] = useState({
    sourceId: '',
    couponCode: '',
    batchCode: '',
    couponDetails: null,
    batchDetails: null,
    leftTabIndex: 0,
    rightTabIndex: 0,
    showCard: false,
  });

  const [generatePageState, setGeneratePageState] = useState({
    leftTabIndex: 0,
    rightTabIndex: 0,
    sourceId: '',
    batchCode: '',
    itemId: '',
    startDate: '',
    expirationDate: '',
    count: '',
  });

  return (
    <CouponContext.Provider value={{
      coupons,
      setCoupons,
      getPageState,
      setGetPageState,
      generatePageState,
      setGeneratePageState
    }}>
      {children}
    </CouponContext.Provider>
  );
};
