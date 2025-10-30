import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Car, MapPin, Clock, Shield, Fuel, IndianRupee } from "lucide-react";

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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cart.map((cab) => (
                <Card key={cab.id} className="overflow-hidden animate-fade-in group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      {cab.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={cab.image || cab.cabImageUrl || ""}
                      alt={cab.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{cab.rating}</span>
                    </div>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {cab.type}
                    </Badge>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-primary" />
                        <span>₹{cab.pricePerKm} per km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Seats: {cab.seats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-primary" />
                        <span>{cab.fuelType || cab.fluelType || ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{cab.insurance ? "Insured" : "No Insurance"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        style={{ background: "#199675" }}
                        className="flex-1 text-white"
                        onClick={() => handleBook(cab.id)}
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRemove(cab.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
