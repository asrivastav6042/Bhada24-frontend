import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotificationManager from "./components/notification/NotificationManager";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import CartCabDetails from "./pages/CartCabDetails";
import CabResults from "./pages/CabResults";
import ReviewBooking from "./pages/ReviewBooking";
import PaymentReceipt from "./pages/PaymentReceipt";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/dashboard/MyProfile";
import MyBookings from "./pages/dashboard/MyBookings";
import BookingDetails from "./pages/dashboard/BookingDetails";
import Rating from "./pages/dashboard/Rating";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import OurServices from "./pages/OurServices";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import TransportBooking from "./pages/TransportBooking";
import DJSoundBooking from "./pages/DJSoundBooking";
import EventManagement from "./pages/EventManagement";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NotificationManager />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cab-results" element={<CabResults />} />
          <Route path="/review-booking" element={<ReviewBooking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart-cab-details" element={<CartCabDetails />} />
          <Route path="/receipt" element={<PaymentReceipt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="profile" element={<MyProfile />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="bookings/:bookingId" element={<BookingDetails />} />
            <Route path="rating" element={<Rating />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/transport-booking" element={<TransportBooking />} />
          <Route path="/dj-sound-booking" element={<DJSoundBooking />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
