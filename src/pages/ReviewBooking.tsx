import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Car, MapPin, Calendar, User, Mail, Phone, CreditCard, Star, Shield, Clock, Fuel, IndianRupee } from "lucide-react";
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
import cabsData from "@/data/cabs.json";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  const cabId = searchParams.get("cabId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  const cab = cabsData.find((c) => c.id === cabId);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!cab || !from || !to || !date) {
      toast.error("Missing booking information");
      navigate("/");
    }
  }, [cab, from, to, date, navigate]);

  if (!cab || !from || !to || !date) return null;

  const estimatedDistance = 100; // Mock distance
  const baseFare = cab.basePrice + cab.pricePerKm * estimatedDistance;
  const gst = baseFare * 0.18;
  const totalFare = baseFare + gst;

  const handlePayment = (method: string, isAdvance: boolean) => {
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
        cabName: cab.name,
        cabType: cab.type,
        regNo: cab.regNo,
        from: from || "",
        to: to || "",
        date: date || "",
        passengerName: formData.name,
        passengerPhone: formData.phone,
        passengerEmail: formData.email,
        baseFare,
        gst,
        totalFare,
        paymentMethod,
        paymentDate: new Date().toLocaleDateString(),
      };

      // Store in sessionStorage for receipt page
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

      toast.success("Payment successful! Redirecting...");
      setProcessing(false);
      setShowPaymentModal(false);

      setTimeout(() => {
        navigate("/receipt");
      }, 1000);
    }, 2000);
  };

  const cabImages = cab.images || [cab.image];
  const estimatedTravelTime = 13.5;
  const tripType = searchParams.get("tripType") || "Round Trip";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Review Your Booking</h1>

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
                                alt={`${cab.name} view ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                      
                      {/* Thumbnail Preview */}
                      <div className="flex gap-2 mt-3">
                        {cabImages.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-12 object-cover rounded border-2 border-border cursor-pointer hover:border-primary transition-colors"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Cab Information */}
                    <div className="md:col-span-3 space-y-4">
                      <div>
                        <h3 className="font-bold text-2xl mb-2">{cab.name}</h3>
                        <p className="text-muted-foreground">
                          {cab.type} • {cab.ac ? "AC" : "Non-AC"} • {cab.seats} Seats • Model: {cab.model || "2023"} • Color: {cab.color || "Silver"}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-semibold">{cab.rating || 5.0}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({cab.reviewsCount || 1} reviews)
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
                            <p className="font-medium">INR {cab.pricePerKm} per km</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Fuel className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Fuel Type</p>
                            <p className="font-medium">{cab.fuelType || "Petrol"}</p>
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
                            <p className="font-medium">{cab.insurance ? "YES" : "NO"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="pt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Registration:</span> {cab.regNo}</p>
                        <p><span className="font-medium">Toll tax:</span> {cab.tollTax ? "Included" : "Not included"}</p>
                        <p><span className="font-medium">Trip Type:</span> {tripType}</p>
                      </div>
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
