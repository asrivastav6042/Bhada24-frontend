
import { COLORS } from "@/styles/colors";
import { Star, Users, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useNavigate, useLocation } from "react-router-dom";

interface CabCardProps {
  cab: {
    id: string;
    name: string;
    type: string;
    image: string;
    seats: number;
    ac: boolean;
    pricePerKm: number;
    basePrice: number;
    rating: number;
    regNo: string;
  };
  onBook: (cabId: string) => void;
  cabDetailsForBooking?: any; // Complete cab data for booking
}

const CabCard = ({ cab, onBook, cabDetailsForBooking }: CabCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cabCart') || '[]');
    if (!cart.find((item: any) => item.id === cab.id)) {
      cart.push(cab);
      localStorage.setItem('cabCart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cabCartUpdated'));
    }
  };
  
  const handleCardClick = () => {
    // Get search details from location state
    const search = location.state?.search || {};
    const from = search.pickupLocation || "";
    const to = search.dropLocation || "";
    const date = search.pickupDateTime ? search.pickupDateTime.split('T')[0] : "";
    
    // Navigate to ReviewBooking page with complete cab details
    navigate('/review-booking', {
      state: {
        cabDetails: cabDetailsForBooking || cab,
        search: { from, to, date }
      }
    });
  };
  
  return (
    <div
      style={{ cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
        <div className="relative overflow-hidden">
          <img
            src={cab.image}
            alt={cab.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
            style={{ background: COLORS.green, color: '#fff' }}>
            <Star className="h-4 w-4 fill-current" style={{ color: '#fff' }} />
            {cab.rating}
          </div>
        </div>
        <CardContent className="p-4 sm:p-5">
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg truncate">{cab.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{cab.type}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.black }}>₹{Number(cab.pricePerKm).toFixed(2)}</p>
              <p className="text-xs" style={{ color: COLORS.black }}>per km</p>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1" style={{ color: COLORS.black }}>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" style={{ color: COLORS.black }} />
              <span className="whitespace-nowrap">{cab.seats} Seats</span>
            </div>
            {cab.ac && (
              <div className="flex items-center gap-1" style={{ color: COLORS.black }}>
                <Wind className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" style={{ color: COLORS.black }} />
                <span>AC</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Base Fare: <span className="font-semibold" style={{ color: COLORS.black }}>₹{Number(cab.basePrice).toFixed(2)}</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-5 pt-0" onClick={e => e.stopPropagation()}>
          <Button 
            style={{ background: COLORS.green }}
            className="w-full hover:opacity-90 transition-opacity text-sm sm:text-base text-white mb-2"
            onClick={e => { e.stopPropagation(); onBook(cab.id); }}
          >
            Book Now
          </Button>&nbsp;&nbsp;&nbsp;
          <Button 
            style={{ background: COLORS.primary }}
            className="w-full hover:opacity-90 transition-opacity text-sm sm:text-base text-white mb-2"
            onClick={e => { e.stopPropagation(); handleAddToCart(); }}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CabCard;
