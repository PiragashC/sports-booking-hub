import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import ErrorBoundary from './Components/ErrorBoundary';

import WebLayout from './Layout/Web/WebLayout';
import Home from './Pages/Home/Home';
import ContactUs from './Pages/ContactUs/ContactUs';

import AppLayout from './Layout/App/AppLayout';
import Booking from './Pages/Booking/Booking';
import BookingCopy from './Pages/Booking/Booking copy';
import AdminLogin from './Pages/Login/AdminLogin';

import AdminLayout from './Layout/Admin/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import BookingManagement from './Pages/Admin/BookingManagement/BookingManagement';
import LaneManagement from './Pages/Admin/LaneManagement/LaneManagement';

function App() {
  const value = {
    ripple: true,
  };
  return (
    <PrimeReactProvider value={value}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Web routes */}
            <Route path='/' element={<WebLayout />}>
              <Route index element={<Home />} />
              <Route path="contact-us" element={<ContactUs />} />
            </Route>

            {/* App routes */}
            <Route path='/' element={<AppLayout />}>
              <Route path="booking" element={<BookingCopy />} />
            </Route>

            <Route path="/login/admin" element={<AdminLogin />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="booking-management" element={<BookingManagement />} />
              <Route path="lane-management" element={<LaneManagement />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
