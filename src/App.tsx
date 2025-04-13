import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import ErrorBoundary from './Components/ErrorBoundary';

/* Web routes */
import WebLayout from './Layout/Web/WebLayout';
import Home from './Pages/Home/Home';
import Gallery from './Pages/Gallery/Gallery';
import Events from './Pages/Events/Events';
import Blogs from './Pages/Blogs/Blogs';

/* Admin routes */
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
import Upload from './Components/Upload';

function App() {
  useAuthSession();
  const value = {
    ripple: true,
  };
  return (
    <PrimeReactProvider value={value}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* Web Routes - Only accessible by users */}
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<WebLayout />}>
                <Route index element={<Home />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="events" element={<Events />} />
                <Route path="blogs" element={<Blogs />} />
              </Route>
            </Route>

            {/* App Routes - Only accessible by users */}
            <Route element={<AppRoutes />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="booking" element={<BookingCopy />} />
              </Route>
            </Route>

            {/* Admin Login Route - Redirects to /admin if already logged in */}
            <Route element={<AdminLoginGuard />}>
              <Route path="/login/admin" element={<AdminLogin />} />
            </Route>

            {/* Admin Routes - Only accessible by admin */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="booking-management" element={<BookingManagement />} />
                <Route path="lane-management" element={<LaneManagement />} />
                <Route path="extras" element={<Extras />} />
              </Route>
            </Route>
            <Route path="/img-editor" element={<Upload />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
