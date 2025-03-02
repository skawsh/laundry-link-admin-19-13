
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LaundryServicesPage from './pages/LaundryServices';

// This is a route component that can be imported and used in your main routing setup
const LaundryServicesRoute = () => (
  <Route path="/laundry-services" element={<LaundryServicesPage />} />
);

export default LaundryServicesRoute;
