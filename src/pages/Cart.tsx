import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, Car, MapPin, Clock, Shield, Fuel, IndianRupee, CreditCard, Tag, X, Check } from "lucide-react";
import { getAllOffers } from "@/apiconfig/api";
import { useToast } from "@/hooks/use-toast";
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

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [paymentType, setPaymentType] = useState<"token" | "full">("full");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { execute: fetchOffersApi } = useApiCall();

  useEffect(() => {
    const stored = localStorage.getItem("cabCart");
    setCart(stored ? JSON.parse(stored) : []);
    fetchOffers();
  }, []);

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
        showErrorToast: true,
        redirectOnAuthError: true,
      }
    );
  };

  const calculateBaseFare = () => {
    // Use fare field if available, otherwise fall back to basePrice
    return cart.reduce((sum, cab) => sum + (Number(cab.fare) || Number(cab.basePrice) || 0), 0);
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
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive",
      });
      return;
    }
    
    const baseFare = calculateBaseFare();
    
    if (baseFare < offer.minFare) {
      toast({
        title: "Minimum Fare Required",
        description: `This coupon requires a minimum fare of ₹${offer.minFare}`,
        variant: "destructive",
      });
      return;
    }
    
    setAppliedCoupon(offer);
    setCouponCode("");
    setShowOffers(false);
    toast({
      title: "Coupon Applied!",
      description: offer.description,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your cart",
    });
  };

  const handleRemove = (id: string) => {
    const updated = cart.filter((cab) => cab.id !== id);
    setCart(updated);
    localStorage.setItem("cabCart", JSON.stringify(updated));
  };

  const handleBook = (cabId: string) => {
    navigate("/review-booking", { state: { registrationId: cabId } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Review your Booking</h1>
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No cabs in your cart. Add cabs to cart from the results page.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Cab Details (spans 2 columns) */}
              <div className="lg:col-span-2">
                {/* Display cabs in a 2-column grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {cart.map((cab) => (
                    <div
                      key={cab.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/cart-cab-details', { state: { cab } })}
                    >
                      <Card className="overflow-hidden animate-fade-in group hover:shadow-lg transition-shadow h-full relative">
                        {/* Remove Icon - Top Right */}
                        <button
                          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-md"
                          onClick={e => { e.stopPropagation(); handleRemove(cab.id); }}
                          aria-label="Remove from cart"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        
                        <CardContent className="p-3">
                          {/* Image */}
                          <div className="flex items-center justify-center mb-2">
                            <img
                              src={cab.image || cab.cabImageUrl || ""}
                              alt={cab.name}
                              className="h-16 w-full object-contain rounded-lg"
                            />
                          </div>
                          
                          {/* Cab Info */}
                          <div className="space-y-1.5">
                            <h3 className="font-bold text-base">{cab.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {cab.type} • {cab.ac ? "AC" : "Non-AC"} • {cab.seats} Seats
                            </p>
                            
                            {/* Key Details */}
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3 text-primary" />
                                  <span className="text-xs text-muted-foreground">Extra km</span>
                                </div>
                                <span className="font-medium text-xs">₹{Number(cab.pricePerKm).toFixed(2)}/km</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                  <Fuel className="h-3 w-3 text-primary" />
                                  <span className="text-xs text-muted-foreground">Fuel</span>
                                </div>
                                <span className="font-medium text-xs">{cab.fuelType || cab.fluelType || "Petrol"}</span>
                              </div>
                            </div>
                            
                            {/* Fare display */}
                            <div className="pt-1.5 border-t mt-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">Fare:</span>
                                <span className="text-base font-bold text-primary">₹{(Number(cab.fare) || Number(cab.basePrice) || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Payment Summary */}
              <div className="space-y-6">
                {/* Coupon Section */}
                <Card className="overflow-hidden animate-fade-in">
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

                <Card className="overflow-hidden animate-fade-in group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Calculate payment summary for all cabs */}
                    {(() => {
                      const rawBaseFare = calculateBaseFare();
                      const discount = calculateDiscount();
                      const fareBreakdown = calculateNewFareBreakdown(rawBaseFare, discount);
                      const { baseFare, couponDiscount, finalAmount, gstAmount, totalWithGst, tokenAmount } = fareBreakdown;
                      
                      // Amount to pay based on payment type
                      const amountToPay = paymentType === "token" ? tokenAmount : totalWithGst;
                      const remainingAmount = paymentType === "token" ? totalWithGst - tokenAmount : 0;
                      
                      return (
                        <>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm">Base Fare</span>
                              <span className="font-semibold">₹{baseFare.toFixed(2)}</span>
                            </div>
                            
                            {/* Discount Section - only show if coupon is applied */}
                            {appliedCoupon && couponDiscount > 0 && (
                              <>
                                <div className="flex justify-between text-green-600">
                                  <span className="text-sm">Coupon Discount ({appliedCoupon.promocode})</span>
                                  <span className="font-semibold">-₹{couponDiscount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Final Amount</span>
                                  <span className="font-semibold">₹{finalAmount.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                            
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
                          <div className="border-t pt-4 mt-4">
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
                              <div className="mt-3 bg-primary/10 border border-primary/20 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <div className="text-primary mt-0.5">ℹ️</div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-primary">Remaining Payment</p>
                                    <p className="text-xs text-primary/80 mt-1">
                                      You will pay <span className="font-semibold">₹{remainingAmount.toFixed(2)}</span> to the driver after completing the trip.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <Button
                              style={{ background: "#e00" }}
                              className="w-full text-white text-base font-semibold py-2"
                              onClick={() => {
                                // Book all cabs (could navigate to payment or booking page)
                                cart.forEach((cab) => handleBook(cab.id));
                              }}
                            >
                              Proceed to Pay ₹{amountToPay.toFixed(2)}
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
