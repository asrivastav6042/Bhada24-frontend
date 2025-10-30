import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Car, MapPin, Clock, Shield, Fuel, IndianRupee, CreditCard } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cabCart");
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

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
                        <span>₹{cart.reduce((sum, cab) => sum + (Number(cab.basePrice) || 0), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>GST (18%)</span>
                        <span>₹{(cart.reduce((sum, cab) => sum + (Number(cab.basePrice) || 0), 0) * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-primary mb-2">
                        <span>Total Fare</span>
                        <span>₹{(cart.reduce((sum, cab) => sum + (Number(cab.basePrice) || 0), 0) * 1.18).toFixed(2)}</span>
                      </div>
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
