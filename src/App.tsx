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
import BookingView from './Pages/Booking/BookingView';

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
              <Route path="booking" element={<Booking />} />
              <Route path="booking/view" element={<BookingView />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
