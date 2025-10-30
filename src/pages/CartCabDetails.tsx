import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Car, Clock, Shield, Fuel, IndianRupee } from "lucide-react";

const CartCabDetails = () => {
  const location = useLocation();
  const cab = location.state?.cab;

  if (!cab) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-lg font-semibold text-primary">No cab details found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">Cab Details</h1>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                {cab.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-6">
                {/* Image */}
                <div className="md:col-span-2 flex items-center justify-center">
                  <img
                    src={cab.image || cab.cabImageUrl || ""}
                    alt={cab.name}
                    className="h-32 sm:h-40 object-cover rounded-lg"
                  />
                </div>
                {/* Cab Info */}
                <div className="md:col-span-3 space-y-3 sm:space-y-4">
                  <h3 className="font-bold text-xl sm:text-2xl mb-2">{cab.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {cab.type} • {cab.ac ? "AC" : "Non-AC"} • {cab.seats} Seats
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{cab.rating}</span>
                  </div>
                  <Badge variant="secondary" className="w-fit mb-2">
                    Value for money
                  </Badge>
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
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-black">Fare: ₹{Number(cab.basePrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartCabDetails;
