import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car, MapPin, Calendar, User, CreditCard, Star, Shield, Clock, Fuel, IndianRupee } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { getProfileByMobile } from "@/services/userService";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationId, search } = location.state || {};
  // Debug: log navigation state for troubleshooting
  console.debug('ReviewBooking location.state:', location.state);
  const [cabDetails, setCabDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
  if (registrationId) {
      (async () => {
        try {
          const { request, BASE_URL } = await import("@/apiconfig/api");
          const token = localStorage.getItem("bhada24_token") || localStorage.getItem("token");
          const apiUrl = `${BASE_URL}/api/cab/registration/get/${registrationId}`;
          console.log('Fetching cab details:', { registrationId, apiUrl });
          const res = await request(`/api/cab/registration/get/${registrationId}`, "GET", undefined, undefined, token);
          if (Array.isArray(res?.responseData) && res.responseData.length > 0) {
            setCabDetails(res.responseData[0]);
          } else if (res?.responseData) {
            setCabDetails(res.responseData);
          } else {
            setError("No cab details found.");
          }
        } catch (err) {
          setError("Failed to fetch cab details.");
        } finally {
          setLoading(false);
        }
      })();
    } else {
  setError("Missing booking information. Please ensure you are booking from the cab results page and registrationId is passed in navigation state.");
  setLoading(false);
    }

    // Fetch logged-in user info and set form fields
    const phone = localStorage.getItem("userPhone") || sessionStorage.getItem("userPhone");
    if (phone) {
      getProfileByMobile(phone).then((user) => {
        if (user) {
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
          });
        }
      });
    }
  }, [registrationId]);

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

  // Use API cab details
  const cab = cabDetails.cabInfo || cabDetails.cab || cabDetails;
  const from = search?.from || "";
  const to = search?.to || "";
  const date = search?.date || "";

  // Fallbacks for template
  const cabImages = [cab.cabImageUrl || cab.image || ""];
  const estimatedDistance = 100; // Mock distance
  const baseFare = (cabDetails.baseFare || 0) + (cabDetails.perKmRate || 0) * estimatedDistance;
  const gst = baseFare * 0.18;
  const totalFare = baseFare + gst;
  const estimatedTravelTime = 13.5;
  const tripType = "Round Trip";

  const handlePayment = (method, isAdvance) => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all traveller details");
      return;
    }
    setPaymentMethod(method);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const bookingId = `BT${Date.now().toString().slice(-8)}`;
      const bookingData = {
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
        baseFare,
        gst,
        totalFare,
        paymentMethod,
        paymentDate: new Date().toLocaleDateString(),
      };
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      toast.success("Payment successful! Redirecting...");
      setProcessing(false);
      setShowPaymentModal(false);
      setTimeout(() => {
        navigate("/receipt");
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Review Your Booking</h1>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Cab & Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cab Details with Image Carousel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Cab Details
                  </CardTitle>
                </CardHeader>
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
                          <span className="font-semibold">{cabDetails.ratingAvarage || 5.0}</span>
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
                            <p className="font-medium">INR {cabDetails.perKmRate} per km</p>
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
                    />
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
            <div className="lg:col-span-1">
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
                      <span className="font-semibold">₹{baseFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">GST (18%)</span>
                      <span className="font-semibold">₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total Fare</span>
                      <span className="text-primary">₹{totalFare.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={() => handlePayment("Advance Payment", true)}
                    >
                      Pay Advance (30%)
                    </Button>
                    <Button
                      size="lg"
                      className="w-full gradient-hero"
                      onClick={() => handlePayment("Full Payment", false)}
                    >
                      Pay Full Amount
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
      <Footer />
    </div>
  );
};

export default ReviewBooking;
