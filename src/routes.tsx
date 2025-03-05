
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import StudioServices from "@/pages/StudioServices";
import Studios from "@/pages/Studios";
import StudioDetails from "@/pages/StudioDetails";
import StudioPayments from "@/pages/StudioPayments";
import StudioAnalytics from "@/pages/StudioAnalytics";
import AddStudio from "@/pages/AddStudio";
import Index from "@/pages/Index";
import Drivers from "@/pages/Drivers";
import DriverProfile from "@/pages/DriverProfile";
import LaundryServices from "@/pages/LaundryServices";
import Revenue from "@/pages/Revenue";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import OrderAssignment from "@/pages/OrderAssignment";
import Users from "@/pages/Users";
import OnboardingRequests from "@/pages/OnboardingRequests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/studios",
    element: <Studios />,
  },
  {
    path: "/studios/add",
    element: <AddStudio />,
  },
  {
    path: "/studios/details/:studioId",
    element: <StudioDetails />,
  },
  {
    path: "/studios/services/:studioId",
    element: <StudioServices />,
  },
  {
    path: "/studios/payments/:studioId",
    element: <StudioPayments />,
  },
  {
    path: "/studios/analytics/:studioId",
    element: <StudioAnalytics />,
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
    path: "/services",
    element: <LaundryServices />,
  },
  {
    path: "/revenue",
    element: <Revenue />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/order-details/:orderId",
    element: <OrderDetails />,
  },
  {
    path: "/orders/assignment",
    element: <OrderAssignment />,
  },
  {
    path: "/users",
    element: <Users />,
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

export default router;
