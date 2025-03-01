import {
  createBrowserRouter,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ContactUs } from "./pages/ContactUs";
import { AboutUs } from "./pages/AboutUs";
import { Pricing } from "./pages/Pricing";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { AuthLayout } from "./components/layout/AuthLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ErrorPage } from "./pages/ErrorPage";
import { Admin } from "./pages/Admin";
import { AdminLayout } from "./components/layout/AdminLayout";
import Studios from "./pages/Studios";
import StudioDetails from "./pages/StudioDetails";
import StudioAnalytics from "./pages/StudioAnalytics";
import StudioPayments from "./pages/StudioPayments";
import StudioServices from "./pages/StudioServices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/studios",
        element: <Studios />,
      },
      {
        path: "/studio-details/:studioId",
        element: <StudioDetails />,
      },
      {
        path: "/studio-analytics/:studioId",
        element: <StudioAnalytics />,
      },
      {
        path: "/studio-payments/:studioId",
        element: <StudioPayments />,
      },
    ],
  },
  {
    path: "/studio-services/:studioId",
    element: <StudioServices />,
  },
]);

export default router;
