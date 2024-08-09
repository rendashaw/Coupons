import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import GeneratePage from './components/GeneratePage';
import GetPage from './components/GetPage';
import ListPage from './components/ListPage';
import RevokePage from './components/RevokePage';
import RedeemPage from './components/RedeemPage';
import { CouponProvider } from './components/CouponContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import UpdatePage from './components/UpdatePage';

const App = () => {
  return (
    <CouponProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <TransitionRoutes />
          </div>
        </div>
      </Router>
    </CouponProvider>
  );
};

const TransitionRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
        <div className="route-section">
          <Routes location={location}>
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/get" element={<GetPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/revoke" element={<RevokePage />} />
            <Route path="/update" element={<UpdatePage />} />
            <Route path="/redeem" element={<RedeemPage />} />
            {/* Add other routes here if needed */}
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
