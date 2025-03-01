
import { createBrowserRouter, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import DriverProfile from "./pages/DriverProfile";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderAssignment from "./pages/OrderAssignment";
import Revenue from "./pages/Revenue";
import Studios from "./pages/Studios";
import StudioDetails from "./pages/StudioDetails";
import StudioAnalytics from "./pages/StudioAnalytics";
import StudioServices from "./pages/StudioServices";
import StudioPayments from "./pages/StudioPayments";
import AddStudio from "./pages/AddStudio";
import OnboardingRequests from "./pages/OnboardingRequests";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/drivers",
    element: <Drivers />,
  },
  {
    path: "/driver-profile/:id",
    element: <DriverProfile />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/order/:id",
    element: <OrderDetails />,
  },
  {
    path: "/order-assignment",
    element: <OrderAssignment />,
  },
  {
    path: "/revenue",
    element: <Revenue />,
  },
  {
    path: "/studios",
    element: <Studios />,
  },
  {
    path: "/studio/:id",
    element: <StudioDetails />,
  },
  {
    path: "/studio/:id/analytics",
    element: <StudioAnalytics />,
  },
  {
    path: "/studio/:id/services",
    element: <StudioServices />,
  },
  {
    path: "/studio/:id/payments",
    element: <StudioPayments />,
  },
  {
    path: "/add-studio",
    element: <AddStudio />,
  },
  {
    path: "/onboarding-requests",
    element: <OnboardingRequests />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
