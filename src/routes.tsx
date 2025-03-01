import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Studios from './pages/Studios';
import AddStudio from './pages/AddStudio';
import StudioDetails from './pages/StudioDetails';
import StudioAnalytics from './pages/StudioAnalytics';
import StudioPayments from './pages/StudioPayments';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderAssignment from './pages/OrderAssignment';
import Users from './pages/Users';
import Drivers from './pages/Drivers';
import Revenue from './pages/Revenue';
import OnboardingRequests from './pages/OnboardingRequests';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Studio routes */}
      <Route path="/studios" element={<Studios />} />
      <Route path="/studios/add" element={<AddStudio />} />
      <Route path="/studios/details/:studioId" element={<StudioDetails />} />
      <Route path="/studios/analytics/:studioId" element={<StudioAnalytics />} />
      <Route path="/studios/payments/:studioId" element={<StudioPayments />} />
      <Route path="/studios/services/:studioId" element={<StudioAnalytics />} />
      
      {/* Order routes */}
      <Route path="/orders" element={<Orders />} />
      <Route path="/order-details/:orderId" element={<OrderDetails />} />
      <Route path="/order-assignment" element={<OrderAssignment />} />
      
      {/* Other routes */}
      <Route path="/users" element={<Users />} />
      <Route path="/drivers" element={<Drivers />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/onboarding-requests" element={<OnboardingRequests />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
