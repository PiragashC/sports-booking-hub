import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import ErrorBoundary from './Components/ErrorBoundary';
import WebLayout from './Layout/Web/WebLayout';
import Home from './Pages/Home/Home';
import Gallery from './Pages/Gallery/Gallery';
import Events from './Pages/Events/Events';
import Blogs from './Pages/Blogs/Blogs';

import AppLayout from './Layout/App/AppLayout';
import BookingCopy from './Pages/Booking/Booking copy';
import AdminLogin from './Pages/Login/AdminLogin';
import Extras from './Pages/Admin/Extras/Extras';

import AdminLayout from './Layout/Admin/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import BookingManagement from './Pages/Admin/BookingManagement/BookingManagement';
import LaneManagement from './Pages/Admin/LaneManagement/LaneManagement';

import { AdminLoginGuard, AdminRoutes, AppRoutes, PublicRoutes } from './middleware/AuthGuard';
import { useAuthSession } from './middleware/authMiddleware';

import ErrorPage from './Components/ErrorPage';
import NotFoundPage from './Components/NotFoundPage';
import { DeleteConfirmationProvider } from './Components/DeleteConfirmationProvider';

import { setNavigateCallback } from './Utils/Axios/axiosInstance'; // <-- import here

// The wrapper that includes BrowserRouter
const AppWrapper = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

// The content where useNavigate is allowed
const AppContent = () => {
  useAuthSession();
  const navigate = useNavigate();

  const value = {
    ripple: true,
  };

  // Set navigate callback safely inside router context
  useEffect(() => {
    setNavigateCallback((path: string) => {
      navigate(path);
    });
  }, [navigate]);

  return (
    <PrimeReactProvider value={value}>
      <ErrorBoundary>
        <DeleteConfirmationProvider>
          <Routes>
            {/* Web Routes */}
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<WebLayout />}>
                <Route index element={<Home />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="events" element={<Events />} />
                <Route path="blogs" element={<Blogs />} />
              </Route>
            </Route>

            {/* App Routes */}
            <Route element={<AppRoutes />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="booking" element={<BookingCopy />} />
              </Route>
            </Route>

            {/* Admin Login Route */}
            <Route element={<AdminLoginGuard />}>
              <Route path="/login/admin" element={<AdminLogin />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="booking-management" element={<BookingManagement />} />
                <Route path="lane-management" element={<LaneManagement />} />
                <Route path="extras" element={<Extras />} />
              </Route>
            </Route>

            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DeleteConfirmationProvider>
      </ErrorBoundary>
    </PrimeReactProvider>
  );
};

export default AppWrapper;
