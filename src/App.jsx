import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ClientRoute, AdminRoute } from './routes/ProtectedRoutes';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import ClientDashboard from './pages/ClientDashboard';
import ClientEnquiries from './pages/client/ClientEnquiries';
import ClientProfile from './pages/client/ClientProfile';

import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminEnquiries from './pages/admin/AdminEnquiries';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<div className="text-center py-20 text-2xl font-bold">404 - Page Not Found</div>} />
          </Route>

          {/* Client Routes */}
          <Route element={<ClientRoute />}>
            <Route element={<DashboardLayout isAdmin={false} />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/enquiries" element={<ClientEnquiries />} />
              <Route path="/client/profile" element={<ClientProfile />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout isAdmin={true} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
