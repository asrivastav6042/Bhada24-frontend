import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [showOffers, setShowOffers] = useState(false);
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
    return cart.reduce((sum, cab) => sum + (Number(cab.basePrice) || 0), 0);
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
      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">My Cart</h1>
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No cabs in your cart. Add cabs to cart from the results page.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Cab Details (spans 2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((cab) => (
                  <div
                    key={cab.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/cart-cab-details', { state: { cab } })}
                  >
                    <Card className="overflow-hidden animate-fade-in group" style={{ minHeight: '120px', height: 'auto', paddingTop: '8px' }}>
                      <CardContent>
                        <div className="grid md:grid-cols-5 gap-6">
                          {/* Image */}
                          <div className="md:col-span-2 flex items-center justify-center" style={{ height: '100%' }}>
                            <img
                              src={cab.image || cab.cabImageUrl || ""}
                              alt={cab.name}
                              className="h-16 sm:h-20 object-cover rounded-lg"
                              style={{ marginTop: '0px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                            />
                          </div>
                          {/* Cab Info */}
                          <div className="md:col-span-3 space-y-2 sm:space-y-3" style={{ marginTop: '0px', paddingTop: '0px' }}>
                            <h3 className="font-bold text-xl sm:text-2xl mb-2">{cab.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {cab.type} • {cab.ac ? "AC" : "Non-AC"} • {cab.seats} Seats
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="flex items-center gap-2 text-sm">
                                <IndianRupee className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Extra km fare</p>
                                  <p className="font-medium">₹{Number(cab.pricePerKm).toFixed(2)} per km</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Fuel className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Fuel Type</p>
                                  <p className="font-medium">{cab.fuelType || cab.fluelType || ""}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Travel Time</p>
                                  <p className="font-medium">13.5 hours</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Insurance</p>
                                  <p className="font-medium">{cab.insurance ? "Yes" : "No"}</p>
                                </div>
                              </div>
                            </div>
                            {/* Fare display */}
                            <div className="mt-2">
                              <span className="text-sm font-semibold text-black">Fare: ₹{Number(cab.basePrice).toFixed(2)}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={e => { e.stopPropagation(); handleRemove(cab.id); }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
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
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Base Fare</span>
                        <span>₹{calculateBaseFare().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>GST (18%)</span>
                        <span>₹{(calculateBaseFare() * 0.18).toFixed(2)}</span>
                      </div>
                      
                      {/* Discount Section */}
                      {appliedCoupon && calculateDiscount() > 0 && (
                        <div className="flex justify-between text-sm mb-2 text-green-600">
                          <span>Coupon Discount ({appliedCoupon.promocode})</span>
                          <span>-₹{calculateDiscount().toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 mt-2"></div>
                      <div className="flex justify-between text-lg font-bold text-primary mb-2">
                        <span>Total Fare</span>
                        <span>₹{((calculateBaseFare() * 1.18) - calculateDiscount()).toFixed(2)}</span>
                      </div>
                      
                      {appliedCoupon && calculateDiscount() > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                          <p className="text-xs text-green-700">
                            You saved ₹{calculateDiscount().toFixed(2)} with this coupon! 🎉
                          </p>
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
                        Pay Full Amount
                      </Button>
                    </div>
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
