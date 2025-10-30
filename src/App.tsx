import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import CabResults from "./pages/CabResults";
import ReviewBooking from "./pages/ReviewBooking";
import PaymentReceipt from "./pages/PaymentReceipt";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/dashboard/MyProfile";
import MyBookings from "./pages/dashboard/MyBookings";
import Rating from "./pages/dashboard/Rating";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cab-results" element={<CabResults />} />
          <Route path="/review-booking" element={<ReviewBooking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/receipt" element={<PaymentReceipt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<MyProfile />} />
          <Route path="/dashboard/bookings" element={<MyBookings />} />
          <Route path="/dashboard/rating" element={<Rating />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
