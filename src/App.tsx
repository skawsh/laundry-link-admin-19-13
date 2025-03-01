
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Studios from "./pages/Studios";
import StudioPayments from "./pages/StudioPayments";
import OnboardingRequests from "./pages/OnboardingRequests";
import StudioAnalytics from "./pages/StudioAnalytics";
import StudioDetails from "./pages/StudioDetails";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import OrderAssignment from "./pages/OrderAssignment";
import Revenue from "./pages/Revenue";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/studios/payments" element={<StudioPayments />} />
          <Route path="/studios/payments/:studioId" element={<StudioPayments />} />
          <Route path="/studios/onboarding" element={<OnboardingRequests />} />
          <Route path="/studios/analytics/:studioId" element={<StudioAnalytics />} />
          <Route path="/studios/details/:studioId" element={<StudioDetails />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/assignment" element={<OrderAssignment />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/users" element={<Users />} />
          
          {/* Placeholder route for remaining sections */}
          <Route path="/tickets" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
