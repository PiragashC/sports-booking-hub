import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import ErrorBoundary from './Components/ErrorBoundary';

import Home from './Pages/Home/Home';
import WebLayout from './Layout/Web/WebLayout';

function App() {
  const value = {
    ripple: true,
  };
  return (
    <PrimeReactProvider value={value}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path='/' element={<WebLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
