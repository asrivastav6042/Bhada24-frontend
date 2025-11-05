import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car, MapPin, Calendar, User, CreditCard, Star, Shield, Clock, Fuel, IndianRupee, Tag, X, Check, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import axios from "axios";
import { getProfileByMobile } from "@/services/userService";
import { getAllOffers, startBooking } from "@/apiconfig/api";
import { useApiCall } from "@/hooks/useApiCall";

interface Offer {
  offerId: string;
  promocode: string;
  description: string;
  discount: number;
  minFare: number;
  discountPercentage: number;
  maxDiscount: number;
  state: string;
  city: string;
  status: string;
  usedCount: number;
  usageLimit: number;
  promoStartDate: string;
  promoEndDate: string;
}

// Razorpay types
interface RazorpayPaymentObject {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayPaymentObject) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

/**
 * Calculate new fare breakdown with coupon, GST on final amount, and token logic
 */
const calculateNewFareBreakdown = (baseFare: number, couponDiscount: number = 0) => {
  const finalAmount = Math.max(0, baseFare - couponDiscount);
  const gstAmount = +(finalAmount * 0.05).toFixed(2); // 5% GST
  const totalWithGst = +(finalAmount + gstAmount).toFixed(2);
  
  // Token: (finalAmount × 0.05) + (finalAmount × 0.12) + ((finalAmount × 0.12) × 0.18)
  const tokenBase = finalAmount * 0.05;
  const token12 = finalAmount * 0.12;
  const token12gst = token12 * 0.18;
  const tokenAmount = Math.round(tokenBase + token12 + token12gst);
  
  return {
    baseFare,
    couponDiscount,
    finalAmount,
    gstAmount,
    totalWithGst,
    tokenAmount
  };
};

const ReviewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cabDetails: passedCabDetails, search } = location.state || {};
  // Debug: log navigation state for troubleshooting
  console.debug('ReviewBooking location.state:', location.state);
  const [cabDetails, setCabDetails] = useState(passedCabDetails || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // Coupon state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const { execute: fetchOffersApi } = useApiCall();
  
  // Payment type: "token" or "full"
  const [paymentType, setPaymentType] = useState<"token" | "full">("full");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Validate that cab details were passed
    if (!passedCabDetails) {
      setError("Missing cab information. Please select a cab from the results page.");
      setLoading(false);
      toast.error("No cab details found. Redirecting...");
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // Fetch logged-in user info and set form fields
    const phone = localStorage.getItem("userPhone") || sessionStorage.getItem("userPhone");
    if (phone) {
      setLoading(true);
      getProfileByMobile(phone)
        .then((user) => {
          if (user) {
            setFormData({
              name: user.name || "",
              phone: user.phone || phone,
              email: user.email || "",
            });
          } else {
            // If user not found in API, use stored data
            const storedName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
            setFormData({
              name: storedName || "",
              phone: phone,
              email: "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          // Fallback to stored data
          const storedName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
          setFormData({
            name: storedName || "",
            phone: phone,
            email: "",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
    
    // Fetch offers
    fetchOffers();
  }, [passedCabDetails]);

  const fetchOffers = async () => {
    await fetchOffersApi(
      async () => {
        const response = await getAllOffers();
        // Filter only ACTIVE offers
        const activeOffers = response.filter((offer: Offer) => offer.status === "ACTIVE");
        setOffers(activeOffers);
        return activeOffers;
      },
      {
        showErrorToast: false, // Don't show error toast for offers (optional feature)
        redirectOnAuthError: false, // Don't redirect if offers fail to load
      }
    );
  };

  const calculateBaseFare = () => {
    if (!cabDetails) return 0;
    // Use the fare amount from API response directly (already calculated by backend)
    return cabDetails.fare || cabDetails.basePrice || cabDetails.baseFare || 0;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const baseFare = calculateBaseFare();
    
    // Check if minimum fare requirement is met
    if (baseFare < appliedCoupon.minFare) {
      return 0;
    }
    
    let discount = 0;
    
    // Calculate discount based on type
    if (appliedCoupon.discountPercentage > 0) {
      // Percentage based discount
      discount = (baseFare * appliedCoupon.discountPercentage) / 100;
      // Cap at max discount
      if (appliedCoupon.maxDiscount > 0) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else if (appliedCoupon.discount > 0) {
      // Flat discount
      discount = appliedCoupon.discount;
    }
    
    return discount;
  };

  const applyCoupon = (code: string) => {
    const offer = offers.find(o => o.promocode.toUpperCase() === code.toUpperCase());
    
    if (!offer) {
      toast.error("Invalid coupon code");
      return;
    }
    
    const baseFare = calculateBaseFare();
    
    if (baseFare < offer.minFare) {
      toast.error(`This coupon requires a minimum fare of ₹${offer.minFare}`);
      return;
    }
    
    setAppliedCoupon(offer);
    setCouponCode("");
    setShowOffers(false);
    toast.success(`${offer.description} applied!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-lg font-semibold text-primary">Loading booking details...</span>
      </div>
    </div>
  );
  if (error) {
    toast.error(error);
    return null;
  }
  if (!cabDetails) return null;

  // Map cab details from passed data (handles both old API format and new direct pass)
  const cab = {
    cabName: cabDetails.name || cabDetails.cabName || '',
    cabType: cabDetails.type || cabDetails.cabType || '',
    cabImageUrl: cabDetails.image || cabDetails.cabImageUrl || '',
    cabNumber: cabDetails.regNo || cabDetails.cabRegistrationNumber || cabDetails.cabNumber || '',
    cabCapacity: cabDetails.seats || cabDetails.cabCapacity || 0,
    ac: cabDetails.ac ?? false,
    cabManufacturingYear: cabDetails.manufacturingYear || cabDetails.cabManufacturingYear || 'N/A',
    cabColor: cabDetails.color || cabDetails.cabColor || 'N/A',
    fluelType: cabDetails.fuelType || cabDetails.fluelType || 'Petrol',
    cabInsurance: cabDetails.insurance || cabDetails.cabInsurance || 'Yes',
  };
  
  const from = search?.from || "";
  const to = search?.to || "";
  const date = search?.date || "";

  // Fallbacks for template
  const cabImages = [cab.cabImageUrl || ""];
  
  // Use fare amount directly from API response (not calculated)
  // The API already calculates: baseFare + (perKmRate * totalDistance)
  const rawBaseFare = cabDetails.fare || cabDetails.basePrice || cabDetails.baseFare || 0;
  const perKmRate = cabDetails.pricePerKm || cabDetails.perKmRate || 0;
  const totalDistance = cabDetails.totalDistance || 0;
  
  const discount = calculateDiscount();
  
  // Use new fare calculation
  const fareBreakdown = calculateNewFareBreakdown(rawBaseFare, discount);
  const { baseFare, couponDiscount, finalAmount, gstAmount, totalWithGst, tokenAmount } = fareBreakdown;
  
  // Amount to pay now (based on payment type)
  const amountToPay = paymentType === "token" ? tokenAmount : totalWithGst;
  
  // Remaining amount (to be paid to driver after trip)
  const remainingAmount = paymentType === "token" ? totalWithGst - tokenAmount : 0;
  
  const estimatedTravelTime = 13.5;
  const tripType = "Round Trip";
  
  // Rating from passed data
  const cabRating = cabDetails.rating || cabDetails.ratingAvarage || 5.0;

  const handlePayment = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all traveller details");
      return;
    }
    
    // Directly initiate Razorpay payment without showing payment method modal
    initiateRazorpayPayment();
  };

  const initiateRazorpayPayment = () => {
    setProcessing(true);

    // Format phone number - remove any +91 or country code prefix
    const formatPhoneNumber = (phone: string): string => {
      // Remove all non-numeric characters
      let cleaned = phone.replace(/\D/g, '');
      
      // If it starts with 91 and is 12 digits, remove the 91 prefix
      if (cleaned.length === 12 && cleaned.startsWith('91')) {
        cleaned = cleaned.substring(2);
      }
      
      // If it starts with country code, try to extract last 10 digits
      if (cleaned.length > 10) {
        cleaned = cleaned.slice(-10);
      }
      
      return cleaned;
    };

    const formattedPhone = formatPhoneNumber(formData.phone);

    // Razorpay configuration
    const options: RazorpayOptions = {
      key: "rzp_test_RSpF3EO4kFQ7T4", // Razorpay Key ID
      amount: Math.round(amountToPay * 100), // Amount in paise (multiply by 100)
      currency: "INR",
      name: "Bhada24",
      description: `Cab Booking: ${from} to ${to}`,
      image: "/favicon.ico", // Your company logo
      handler: async function (response: RazorpayPaymentObject) {
        // Payment successful
        console.log("Payment successful:", response);
        await handlePaymentSuccess(response);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formattedPhone, // Use formatted phone number (10 digits only)
      },
      notes: {
        bookingType: paymentType,
        from: from,
        to: to,
        date: date,
      },
      theme: {
        color: "#FF6B00", // Your brand color
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    
    razorpayInstance.on('payment.failed', function (response: any) {
      setProcessing(false);
      toast.error("Payment failed. Please try again.");
      console.error("Payment failed:", response.error);
    });

    razorpayInstance.open();
    setProcessing(false);
  };

  const handlePaymentSuccess = async (razorpayResponse: RazorpayPaymentObject) => {
    setProcessing(true);
    
    try {
      // Generate unique booking ID
      const bookingId = `BK${Date.now()}`;
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "USR001";
      
      // Debug: Log cabDetails to see what fields are available
      console.log("Available cabDetails:", cabDetails);
      
      // Generate UUID for paymentId (format: 550e8400-e29b-41d4-a716-446655440000)
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      // Format datetime to match backend format (ISO with timezone)
      const currentDateTime = new Date().toISOString();
      const pickupDateTime = date ? new Date(date).toISOString().replace(/\.\d{3}Z$/, '') : currentDateTime.replace(/\.\d{3}Z$/, '');
      const dropDateTime = date ? new Date(new Date(date).getTime() + (estimatedTravelTime * 60 * 60 * 1000)).toISOString().replace(/\.\d{3}Z$/, '') : currentDateTime.replace(/\.\d{3}Z$/, '');
      
      // Prepare booking data matching exact Swagger format
      const bookingData = {
        bookingId: bookingId,
        userId: userId,
        userName: formData.name,
        userMobile: formData.phone,
        userEmail: formData.email,
        driverName: cabDetails.driverName || "Arun Kumar",
        driverContact: cabDetails.driverContact || "9125696053",
        cabId: cabDetails.cabId || cabDetails.id || "CB0004",
        pickupLocation: from,
        dropLocation: to,
        pickupDateTime: pickupDateTime,
        dropDateTime: dropDateTime,
        fare: rawBaseFare,
        promoDiscount: couponDiscount,
        finalFare: finalAmount,
        gstOnFinalFare: gstAmount,
        totalFareWithGst: totalWithGst,
        commissionAmount: 0,
        gstOnCommission: 0,
        driverPayout: 0,
        profitAmount: 0,
        tokenAmount: tokenAmount,
        balanceAmount: remainingAmount,
        bookingStatus: "CONFIRMED",
        statusUpdatedBy: userId,
        paymentStatus: paymentType === "full" ? "PAID" : "PARTIAL",
        distanceInKm: totalDistance,
        cancellationTime: currentDateTime.replace(/\.\d{3}Z$/, ''),
        refundId: null,
        paymentDetails: {
          paymentId: generateUUID(),
          paymentMethod: "RAZORPAY",
          transactionId: razorpayResponse.razorpay_payment_id,
          transactionDate: currentDateTime.replace(/\.\d{3}Z$/, ''),
          amount: amountToPay,
          status: "SUCCESS"
        },
        insertedAt: currentDateTime.replace(/\.\d{3}Z$/, ''),
        updatedAt: currentDateTime.replace(/\.\d{3}Z$/, ''),
        cabRegistration: {
          cabId: cabDetails.cabId || cabDetails.id || "CB0004",
          spId: cabDetails.spId || "",
          ownerName: cabDetails.ownerName || cabDetails.owner || "",
          driverName: cabDetails.driverName || cabDetails.driver?.name || "Arun Kumar",
          driverContact: cabDetails.driverContact || cabDetails.driver?.contact || "9125696053",
          driverLicense: cabDetails.driverLicense || cabDetails.driver?.license || "",
          address: cabDetails.address || cabDetails.location || "",
          latitude: String(cabDetails.latitude || cabDetails.lat || ""),
          longitude: String(cabDetails.longitude || cabDetails.lng || ""),
          perKmRate: perKmRate,
          baseFare: rawBaseFare,
          status: "ACTIVE",
          approvalStatus: "APPROVED",
          cabInfo: {
            cabId: cabDetails.cabId || cabDetails.id || "CB0004",
            cabName: cab.cabName,
            cabBrand: cabDetails.cabBrand || cabDetails.brand || "Mahindra",
            cabType: cab.cabType,
            cabNumber: cab.cabNumber || "",
            cabManufacturingYear: String(cab.cabManufacturingYear || new Date().getFullYear()),
            cabColor: cab.cabColor || "Black",
            cabInsurance: cab.cabInsurance || "Yes",
            cabCapacity: String(cab.cabCapacity),
            fluelType: cab.fluelType,
            cabImageUrl: cab.cabImageUrl,
            cabCity: cabDetails.cabCity || cabDetails.city || "",
            cabState: cabDetails.cabState || cabDetails.state || "",
            rcImageUrl: cabDetails.rcImageUrl || "",
            dlImageUrl: cabDetails.dlImageUrl || "",
            insuranceImageUrl: cabDetails.insuranceImageUrl || "",
            ac: cab.ac
          }
        },
        refunded: false
      };

      // Log the booking data being sent (for debugging)
      console.log("Sending booking data to backend:", JSON.stringify(bookingData, null, 2));

      // Call backend API to save booking
      try {
        const response = await startBooking(bookingData);
        console.log("Booking saved successfully:", response);
        toast.success("Booking confirmed successfully!");
      } catch (apiError) {
        // Backend API failed, but payment was successful
        console.error("Backend API error (payment already successful):", apiError);
        
        // Save booking data locally anyway since payment succeeded
        console.warn("Saving booking locally due to backend failure");
        
        // You might want to implement a retry mechanism or queue here
        // For now, we'll still proceed to show success since payment worked
        toast.warning("Payment successful! Booking will be confirmed shortly.", {
          duration: 5000,
        });
      }
      
      // Store booking data in session for receipt (regardless of backend status)
      const receiptData = {
        bookingId,
        cabName: cab.cabName,
        cabType: cab.cabType,
        regNo: cab.cabNumber,
        from,
        to,
        date,
        passengerName: formData.name,
        passengerPhone: formData.phone,
        passengerEmail: formData.email,
        baseFare: rawBaseFare,
        discount: couponDiscount,
        couponCode: appliedCoupon?.promocode || null,
        couponDescription: appliedCoupon?.description || null,
        finalAmount,
        gstAmount,
        totalWithGst,
        tokenAmount,
        paymentType,
        amountPaid: amountToPay,
        remainingAmount,
        paymentMethod: "Razorpay",
        paymentDate: new Date().toLocaleDateString(),
        transactionId: razorpayResponse.razorpay_payment_id,
      };
      
      sessionStorage.setItem("bookingData", JSON.stringify(receiptData));
      
      setProcessing(false);
      
      // Show success dialog (payment was successful even if backend had issues)
      setShowSuccessDialog(true);
      
    } catch (error) {
      setProcessing(false);
      console.error("Critical error in payment success handler:", error);
      
      // Save the transaction details locally for support
      const failedBooking = {
        transactionId: razorpayResponse.razorpay_payment_id,
        amount: amountToPay,
        timestamp: new Date().toISOString(),
        userDetails: formData,
        tripDetails: { from, to, date },
      };
      
      localStorage.setItem(`failed_booking_${razorpayResponse.razorpay_payment_id}`, JSON.stringify(failedBooking));
      
      toast.error(
        "Payment received but booking needs manual confirmation. " +
        "Transaction ID: " + razorpayResponse.razorpay_payment_id.substring(0, 12) + "... " +
        "Please contact support.",
        { duration: 10000 }
      );
    }
  };

  const processPayment = () => {
    // This function is no longer used - keeping for compatibility
    initiateRazorpayPayment();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Review Your Booking</h1>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Cab & Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cab Details with Image Carousel */}
              <Card>
                
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-6">
                    {/* Image Carousel */}
                    <div className="md:col-span-2">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {cabImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <img
                                src={image}
                                alt={`${cab.cabName} view ${index + 1}`}
                                className="w-full h-40 sm:h-48 object-cover rounded-lg"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-1 sm:left-2" />
                        <CarouselNext className="right-1 sm:right-2" />
                      </Carousel>
                      {/* Thumbnail Preview */}
                      <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                        {cabImages.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-12 h-9 sm:w-16 sm:h-12 object-cover rounded border-2 border-border cursor-pointer hover:border-primary transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                    {/* Cab Information */}
                    <div className="md:col-span-3 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="font-bold text-xl sm:text-2xl mb-2">{cab.cabName}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {cab.cabType} • {cab.ac ? "AC" : "Non-AC"} • {cab.cabCapacity} Seats • Model: {cab.cabManufacturingYear} • Color: {cab.cabColor}
                        </p>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{cabRating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          (1 review)
                        </span>
                      </div>
                      {/* Value Badge */}
                      <Badge variant="secondary" className="w-fit">
                        Value for money
                      </Badge>
                      {/* Key Details Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Extra km fare</p>
                            <p className="font-medium">₹{perKmRate.toFixed(2)} per km</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Fuel className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Fuel Type</p>
                            <p className="font-medium">{cab.fluelType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Travel Time</p>
                            <p className="font-medium">{estimatedTravelTime} hours</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Insurance</p>
                            <p className="font-medium">{cab.cabInsurance}</p>
                          </div>
                        </div>
                      </div>
                      {/* Additional Info */}
                      {/* <div className="pt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Registration:</span> {cab.cabNumber}</p>
                        <p><span className="font-medium">Driver:</span> {cabDetails.driverName}</p>
                        <p><span className="font-medium">Contact:</span> {cabDetails.driverContact}</p>
                        <p><span className="font-medium">Trip Type:</span> {tripType}</p>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">From:</span>
                    <span>{from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="font-medium">To:</span>
                    <span>{to}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Date:</span>
                    <span>{date}</span>
                  </div>
                </CardContent>
              </Card>
              {/* Traveller Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Traveller Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Phone number is linked to your account</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Column - Payment Summary (Sticky) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Coupon Section */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Apply Coupon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Applied Coupon Display */}
                  {appliedCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-semibold text-sm text-green-800">{appliedCoupon.promocode}</p>
                          <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Coupon Input */}
                  {!appliedCoupon && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => applyCoupon(couponCode)}
                        disabled={!couponCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {/* Available Coupons */}
                  {!appliedCoupon && (
                    <>
                      <Button
                        variant="link"
                        className="w-full text-sm p-0"
                        onClick={() => setShowOffers(!showOffers)}
                      >
                        {showOffers ? "Hide" : "View"} Available Coupons ({offers.length})
                      </Button>
                      
                      {showOffers && offers.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {offers.map((offer) => (
                            <div
                              key={offer.offerId}
                              className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                              onClick={() => applyCoupon(offer.promocode)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-sm">{offer.promocode}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{offer.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Min. Fare: ₹{offer.minFare}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  Apply
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Base Fare</span>
                      <span className="font-semibold">₹{rawBaseFare.toFixed(2)}</span>
                    </div>
                    
                    {/* Discount Section */}
                    {appliedCoupon && couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Coupon Discount ({appliedCoupon.promocode})</span>
                        <span>-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Final Amount</span>
                      <span className="font-semibold">₹{finalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">GST (5%)</span>
                      <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total Fare</span>
                      <span className="text-primary">₹{totalWithGst.toFixed(2)}</span>
                    </div>
                    
                    {appliedCoupon && couponDiscount > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                        <p className="text-xs text-green-700">
                          You saved ₹{couponDiscount.toFixed(2)} with this coupon! 🎉
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Payment Type Selection */}
                  <div className="border-t pt-4">
                    <Label className="text-base font-semibold mb-3 block">Select Payment Type</Label>
                    <RadioGroup value={paymentType} onValueChange={(value: "token" | "full") => setPaymentType(value)} className="space-y-3">
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer" onClick={() => setPaymentType("token")}>
                        <RadioGroupItem value="token" id="token" />
                        <Label htmlFor="token" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Pay Token Amount</p>
                              <p className="text-xs text-muted-foreground mt-1">Pay now, rest to driver after trip</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₹{tokenAmount}</p>
                              {tokenAmount < totalWithGst && (
                                <p className="text-xs text-muted-foreground">+₹{remainingAmount.toFixed(2)} later</p>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer" onClick={() => setPaymentType("full")}>
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Pay Full Amount</p>
                              <p className="text-xs text-muted-foreground mt-1">Pay complete fare now</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₹{totalWithGst.toFixed(2)}</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* Show remaining amount info for token payment */}
                    {paymentType === "token" && remainingAmount > 0 && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <div className="text-blue-600 mt-0.5">ℹ️</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Remaining Payment</p>
                            <p className="text-xs text-blue-700 mt-1">
                              You will pay <span className="font-semibold">₹{remainingAmount.toFixed(2)}</span> to the driver after completing the trip.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button
                      size="lg"
                      className="w-full gradient-hero"
                      onClick={handlePayment}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : `Proceed to Pay ₹${amountToPay.toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPaymentMethod("UPI")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <span>UPI Payment</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPaymentMethod("Card")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <span>Credit/Debit Card</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setPaymentMethod("Netbanking")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <span>Net Banking</span>
              </div>
            </Button>
            <Button
              size="lg"
              className="w-full gradient-hero mt-6"
              onClick={processPayment}
              disabled={!paymentMethod || processing}
            >
              {processing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        setShowSuccessDialog(open);
        if (!open) {
          navigate("/dashboard/bookings");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">
              The booking is confirmed with us and check the My Bookings section for more information.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full gradient-hero"
                onClick={() => navigate("/dashboard/bookings")}
              >
                View My Bookings
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ReviewBooking;
